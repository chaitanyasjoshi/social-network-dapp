import { assert } from 'chai';

const SocialNetwork = artifacts.require('../src/contracts/SocialNetwork.sol');

require('chai').use(require('chai-as-promised')).should();

contract('SocialNetwork', ([deployer, author, tipper]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await socialNetwork.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await socialNetwork.name();
      assert.equal(name, 'Dapp University Social Network');
    });
  });

  describe('posts', async () => {
    let result, postCount;

    before(async () => {
      result = await socialNetwork.createPost('This is my first post', {
        from: author,
      });
      postCount = await socialNetwork.postCount();
    });

    it('creates posts', async () => {
      // SUCCESS
      assert.equal(postCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'Id is correct');
      assert.equal(
        event.content,
        'This is my first post',
        'Content is correct'
      );
      assert.equal(event.tipAmount, '0', 'Tip amount is correct');
      assert.equal(event.author, author, 'Author is correct');

      // FAILURE: Post must have content
      await socialNetwork.createPost('', { from: author }).should.be.rejected;
    });

    it('lists posts', async () => {
      const latestPost = await socialNetwork.posts(postCount);
      assert.equal(
        latestPost.id.toNumber(),
        postCount.toNumber(),
        'Id is correct'
      );
      assert.equal(
        latestPost.content,
        'This is my first post',
        'Content is correct'
      );
      assert.equal(latestPost.tipAmount, '0', 'Tip amount is correct');
      assert.equal(latestPost.author, author, 'Author is correct');
    });

    it('allows users to tip the post', async () => {});
  });
});
