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

    it("initializes the canditates with the correct values", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.candidates(1);
      }).then(function(candidate) {
        assert.equal(candidate[0], 1, "contains the correct id");
        assert.equal(candidate[1], "Donald Trump", "contains the correct name");
        assert.equal(candidate[2], 0, "contains the correct vote count");
        return electionInstance.candidates(2);
      }).then(function (candidate) {
        assert.equal(candidate[0], 2, "contains the correct id");
        assert.equal(candidate[1], "Joe Biden", "contains the correct name");
        assert.equal(candidate[2], 0, "contains the correct vote count");
      })
    })

    it("throws an exception for double voting", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        candidateId = 2;
        electionInstance.vote(candidateId, {from: accounts[1]})
        return electionInstance.candidates(candidateId);
      }).then(function(candidates) {
        var voteCount = candidate[2];
        assert.equal(voteCount, 1, "accepts first vote");
        //Try to vote again
        return electionInstance.vote(candidateId, {from: accounts[1]})
      }).then(assert.fail).catch(function(error) {
        assert(error.message.indexOf('revert' >= 0, "error msg must contain revert"))
        return electionInstance.candidates(1);
      }).then(function(candidate1) {
        var voteCount = candidate1[2];
        assert.equal(voteCount, 0, "Candidate 1 did not receive 2 votes")
        return electionInstance.candidates(2);
      }).then(function(candidate2) {
        var voteCount = candidate2[2];
        assert.equal(voteCount, 1, "Candidate 2 did not receive 2 votes")
      })
    })

    it("allows a voter to cast a vote", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 1;
          return electionInstance.vote(candidateId, { from: accounts[0] });
        }).then(function(receipt) {
          return electionInstance.voters(accounts[0]);
        }).then(function(voted) {
          assert(voted, "the voter was marked as voted");
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "increments the candidate's vote count");
        })
      });
})