import {
  generateUser,
  generateGroup,
  translate as t,
} from '../../../../helpers/api-integration.helper';

describe('GET /groups/:groupId/chat', () => {
  let user;

  before(() => {
    return generateUser().then((generatedUser) => {
      user = generatedUser;
    });
  });

  context('public Guild', () => {
    let group;

    before(() => {
      return generateUser({balance: 2})
      .then((generatedLeader) => {
        return generateGroup(generatedLeader, {
          name: 'test group',
          type: 'guild',
          privacy: 'public',
        }, {
          chat: [
            'Hello',
            'Welcome to the Guild',
          ],
        });
      })
      .then((createdGroup) => {
        group = createdGroup;
      });
    });

    it('returns Guild chat', () => {
      return user.get(`/groups/${group._id}/chat`)
      .then((getChat) => {
        expect(getChat).to.eql(group.chat);
      });
    });
  });

  context('private Guild', () => {
    let group;

    before(() => {
      return generateUser({balance: 2})
      .then((generatedLeader) => {
        return generateGroup(generatedLeader, {
          name: 'test group',
          type: 'guild',
          privacy: 'private',
        }, {
          chat: [
            'Hello',
            'Welcome to the Guild',
          ],
        });
      })
      .then((createdGroup) => {
        group = createdGroup;
      });
    });

    it('returns error if user is not member of requested private group', () => {
      return expect(
        user.get(`/groups/${group._id}/chat`)
      )
      .to.eventually.be.rejected.and.eql({
        code: 404,
        error: 'NotFound',
        message: t('groupNotFound'),
      });
    });
  });
});
