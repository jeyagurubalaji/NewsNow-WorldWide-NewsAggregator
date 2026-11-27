const bookmarkService = require('../services/bookmarkService');
const { connectDb } = require('../config/db');
const ApiError = require('../utils/ApiError');

async function getBookmarks(req, res, next) {
  try {
    await connectDb();
    const bookmarks = await bookmarkService.getUserBookmarks(req.userEmail);
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
}

async function addBookmark(req, res, next) {
  try {
    await connectDb();
    let { articleId } = req.body;

    // Handle nested or object body fallback
    if (typeof articleId === 'object' && articleId !== null) {
      articleId = articleId.articleId || articleId.link || articleId.url;
    }

    if (!articleId) {
      throw new ApiError(400, 'articleId is required');
    }

    const bookmark = await bookmarkService.addBookmark(req.userEmail, articleId);
    res.json(bookmark);
  } catch (err) {
    next(err);
  }
}

async function removeBookmark(req, res, next) {
  try {
    await connectDb();
    await bookmarkService.removeBookmark(req.userEmail, req.query.articleId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getBookmarks, addBookmark, removeBookmark };