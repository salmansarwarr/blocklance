const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../helper-hardhat.config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Blocklance Unit Tests", () => {
          let blocklance, deployer, user;

          beforeEach(async () => {
              user = (await ethers.getSigners())[1];
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              blocklance = await ethers.getContract("Blocklance", deployer);
          });

          it("should do something", async () => {
              assert(true, true);
              expect(true).to.be(true);
          });
      });
