const _deploy_contracts = require("../migrations/2_deploy_contracts")

var Election = artifacts.require("./Election.sol")

contract("Election", function(accounts) {
    it("Initializes with two candidates", function() {
        return Election.deployed().then(function(instance) {
            return instance.candidatesCount();
        }).then(function(count)  {
            assert.equal(count, 2);
        })
    })
})