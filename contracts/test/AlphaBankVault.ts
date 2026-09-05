import { expect } from "chai";
import { ethers } from "hardhat";

// NOTE: the strategy constructor needs the final vault address, so the MVP test uses
// a predicted deployment address. This makes the dependency explicit and keeps the
// mock strategy locked to one vault.
describe("Boofy AlphaBank MVP", function () {
  it("deposits principal, realizes rewards to USDT and lets the holder claim", async function () {
    const [owner, alice] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockERC20");
    const asset = await Token.deploy("Stake Token", "STK");
    const reward = await Token.deploy("Reward Token", "RWD");
    const usdt = await Token.deploy("Mock USDT", "USDT");

    const Engine = await ethers.getContractFactory("AlphaProfitEngine");
    const engine = await Engine.deploy(await usdt.getAddress());
    const Adapter = await ethers.getContractFactory("MockSwapAdapter");
    const adapter = await Adapter.deploy();
    await engine.setAdapter(await adapter.getAddress(), true);
    await usdt.mint(await adapter.getAddress(), ethers.parseEther("1000000"));

    const ownerNonce = await owner.getNonce();
    // strategy deploy = current nonce; vault deploy = current nonce + 1
    const predictedVault = ethers.getCreateAddress({ from: owner.address, nonce: ownerNonce + 1 });
    const Strategy = await ethers.getContractFactory("MockStakingStrategy");
    const strategy = await Strategy.deploy(predictedVault, await asset.getAddress(), await reward.getAddress());

    const Vault = await ethers.getContractFactory("AlphaBankVault");
    const vault = await Vault.deploy(
      await asset.getAddress(),
      await usdt.getAddress(),
      await strategy.getAddress(),
      await engine.getAddress(),
      await adapter.getAddress(),
      "Boofy AlphaBank STK",
      "abSTK"
    );

    const deposit = ethers.parseEther("1000");
    await asset.mint(alice.address, deposit);
    await asset.connect(alice).approve(await vault.getAddress(), deposit);
    await vault.connect(alice).deposit(deposit, alice.address);

    expect(await strategy.totalManagedAssets()).to.equal(deposit);
    await strategy.setNextReward(ethers.parseEther("100"));
    await vault.harvest(ethers.parseEther("100"));
    expect(await vault.claimableUsdt(alice.address)).to.equal(ethers.parseEther("100"));

    await vault.connect(alice).claimUsdt(alice.address);
    expect(await usdt.balanceOf(alice.address)).to.equal(ethers.parseEther("100"));
  });
});
