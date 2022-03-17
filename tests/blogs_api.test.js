const { default: mongoose } = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.listWithManyBlogs
    .map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('API tests', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned (API GET test)', async () => {
    const startingBlogs = helper.listWithManyBlogs;
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(startingBlogs.length);
  });

  test('all blogs contain an id property', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog).toHaveProperty('id');
    });
  });

  test('a valid blog can be added (API POST test)', async () => {
    const initialBlogs = helper.listWithManyBlogs;
    const newBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://www.example.com',
      likes: 0,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain(newBlog.title);
  });

  test('posting a blog without likes will default likes to 0', async () => {
    const initialBlogs = helper.listWithManyBlogs;
    const noLikesBlog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://www.example.com',
    };
    await api
      .post('/api/blogs')
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
    const initialBlogs = helper.listWithManyBlogs;
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
      .send(noTitleBlog)
      .expect(400);

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
