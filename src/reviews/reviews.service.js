const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const tableName = "reviews as r";

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

async function destroy(reviewId) {
  return db(tableName).where("review_id", reviewId).del();
}

async function list(movieId) {
  return await db(tableName)
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where("movie_id", movieId)
    .then((x) => x.map(addCritic));
}

async function read(reviewId) {
  return db(tableName).where("review_id", reviewId).first();
}

async function readCritic(criticId) {
  return db("critics").where("critic_id", criticId).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
