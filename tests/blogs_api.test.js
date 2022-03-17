const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.listWithManyBlogs);
  await User.deleteMany({});
  await User.insertMany(helper.oneUser);
});

describe('api contains initial blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned (API GET test)', async () => {
    const startingBlogs = helper.listWithManyBlogs;
    const response = await api
      .get('/api/blogs');

    expect(response.body).toHaveLength(startingBlogs.length);
  });

  test('all blogs contain an id property', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog).toHaveProperty('id');
    });
  });

  test('an existing blog can be obtained with its id', async () => {
    const initialBlogs = await helper.blogsInDb();
    const blogToObtain = initialBlogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToObtain.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Parsing this way to turn ID into a string instead of object
    const processedBlogToView = JSON.parse(JSON.stringify(blogToObtain));

    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('using a valid id that does not exist returns 404', async () => {
    const validNonexistingId = await helper.getNonexistingId();

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404);
  });

  test('using an invalid id returns 400', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);
  });
});

describe('adding a new blog post', () => {
  test('a valid blog can be added (API POST test)', async () => {
    const initialBlogs = await helper.blogsInDb();
    const newBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://www.example.com',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${helper.getValidToken()}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain(newBlog.title);
  });

  test('posting a blog without likes will default likes to 0', async () => {
    const initialBlogs = await helper.blogsInDb();
    const noLikesBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://www.example.com',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${helper.getValidToken()}`)
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
    const addedBlog = blogsAtEnd.find((blog) => (blog.title === 'Test Blog'));
    expect(addedBlog).toHaveProperty('likes');
    expect(addedBlog.likes).toBe(0);
  });

  test('posting blogs without title or url should return 400 and not be added', async () => {
    const initialBlogs = await helper.blogsInDb();
    const noTitleBlog = {
      author: 'John Doe',
      url: 'https://www.example.com',
      likes: 0,
    };
    const noUrlBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${helper.getValidToken()}`)
      .send(noTitleBlog)
      .expect(400);

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${helper.getValidToken()}`)
      .send(noUrlBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
  test('posting blogs without a proper token will be rejected with code 401', async () => {
    const initialBlogs = await helper.blogsInDb();
    const badToken = 'iAmAVeryBadToken';
    const newBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://www.example.com',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${badToken}`)
      .send(newBlog)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

describe('deleting a blog post', () => {
  test('deleting a blog with a valid id should return 204', async () => {
    const initialBlogs = await helper.blogsInDb();

    const blogToDelete = initialBlogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${helper.getValidToken()}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating an existing post', () => {
  test('changing the number of likes in a post', async () => {
    const initialBlogs = await helper.blogsInDb();

    const blogToModify = initialBlogs[0];
    blogToModify.likes = 30;

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);

    const modifiedBlog = blogsAtEnd.find((blog) => blog.id === blogToModify.id);
    expect(modifiedBlog).toEqual(blogToModify);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
