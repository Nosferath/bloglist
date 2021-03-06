const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const oneUser = [
  {
    _id: '62337da126f49fee20109068',
    username: 'root',
    name: 'John Doe',
    passwordHash: 'badhash',
    blogs: [
      '5a422aa71b54a676234d17f7',
      '5a422a851b54a676234d17f8',
      '5a422a851b54a676234d17f9',
      '5a422a851b54a676234d17fa',
      '5a422a851b54a676234d17fb',
      '5a422a851b54a676234d17fc',
    ],
  },
];

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: '62337da126f49fee20109068',
    likes: 5,
    __v: 0,
  },
];

const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    user: '62337da126f49fee20109068',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: '62337da126f49fee20109068',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    user: '62337da126f49fee20109068',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    user: '62337da126f49fee20109068',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    user: '62337da126f49fee20109068',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    user: '62337da126f49fee20109068',
    likes: 2,
    __v: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getNonexistingId = async () => {
  const blog = new Blog({ title: 'toremovenow', author: 'toremovenow', url: 'toremovenow' });
  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const getValidToken = () => {
  const token = jwt.sign(
    { username: 'root', id: '62337da126f49fee20109068' },
    process.env.SECRET,
    { expiresIn: 60 },
  );
  return token;
};

module.exports = {
  oneUser,
  listWithOneBlog,
  listWithManyBlogs,
  blogsInDb,
  getNonexistingId,
  usersInDb,
  getValidToken,
};
