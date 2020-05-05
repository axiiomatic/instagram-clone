import { isAuth } from '../../authMiddleware';
import models from '../../models';
import {
  AuthenticationError,
  ApolloError,
  UserInputError,
} from 'apollo-server-express';

export default {
  Query: {
    getPostsByUser: async (_, args) => {
      const { userId } = args;

      const postsRow = await models.post.findAll({
        where: { postedBy: userId },
        include: [{ model: models.user }],
      });

      const posts = postsRow.map((post) => post.get({ plain: true }));

      console.log(posts);

      return posts;
    },
  },
  Mutation: {
    createPost: async (_, args, ctx) => {
      isAuth(ctx);

      const { description, image, tags } = args;

      const userId = ctx.payload.userId;

      let userRow;

      try {
        userRow = await models.user.findOne({ where: { id: userId } });
      } catch (err) {
        throw new Error('Error during query to database');
      }

      const user = userRow.get({ plain: true });

      if (!userRow) {
        throw new AuthenticationError('Invalid User');
      }

      let newPost;
      try {
        newPost = await models.post.create({
          postedBy: user.id,
          image,
          description,
          tags,
        });
      } catch (err) {
        console.log(err);
        throw new ApolloError(`Something went wrong!`, '500', { error: err });
      }

      const post = newPost.get({ plain: true });

      console.log(post);

      return 'dasds';
    },
    deletePost: async (_, args, ctx) => {
      isAuth(ctx);
      const { postId } = args;

      const postRow = await models.post.findOne({ where: { id: postId } });

      if (!postRow) {
        throw new UserInputError('No post found');
      }

      const userRow = await models.user.findOne({
        where: { id: ctx.payload.userId },
      });

      if (!userRow) {
        throw new UserInputError('No User found');
      }

      const user = userRow.get({ plain: true });

      const post = postRow.get({ plain: true });

      if (post.postedBy !== user.id) {
        throw new AuthenticationError(
          'Unauthorized request : cannot delete post.'
        );
      }

      let deletedPost;

      try {
        deletedPost = await models.post.destroy({
          where: {
            id: postId,
          },
        });
      } catch (err) {
        throw new ApolloError('Something went wrong', 500, { error: err });
      }

      console.log(deletedPost);
      return {
        ok: true,
      };
    },
  },
};