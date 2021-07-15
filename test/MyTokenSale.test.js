const TokenSale = artifacts.require("MyTokenSale")
const Token = artifacts.require("MyToken")
const KycContract = artifacts.require("KycContract")
require("dotenv").config({path: "../.env"});


const chai = require("./chaisetup.js")
const BN = web3.utils.BN;
const expect = chai.expect


contract("Tokensale Test", async function(accounts) {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await Token.deployed()
        return await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0))
    })

    it("all tokens should be in the Tokensale Smart Contract by default", async () => {
        let instance = await Token.deployed()
        let balanceOfTokenSaleSmartContract = await instance.balanceOf(TokenSale.address)
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(totalSupply)
    })

    it("should be possible to buy tokens", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await KycContract.deployed()
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient)
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei('1', 'wei')})).to.be.rejected;
        await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient))

        await kycInstance.setKycCompleted(recipient)
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei('1', 'wei')})).to.be.fulfilled;
        return await expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient))

    })

});
