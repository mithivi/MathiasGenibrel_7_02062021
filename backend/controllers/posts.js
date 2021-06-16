const { Sequelize } = require("../models");
const DB = require("../models");
const POSTS = DB.posts;
const VOTES = DB.votes;
const Op = DB.Sequelize.Op;

const countVote = (valueVote = "upVote", postId) => {
  console.log(Sequelize.col("sdfsd"));
  const numberVote = VOTES.count({
    where: { vote: valueVote },
  }).then((res) => {
    return res;
  });

  return numberVote;
};

exports.create = (req, res) => {
  if (!req.body.text && !req.body.img_url) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }
  if (!req.body.userId) {
    res.status(400).send({
      message: "userId cannot be empty",
    });
    return;
  }

  const post = {
    text: req.body.text,
    imgUrl: req.body.imgUrl,
    userId: req.body.userId,
  };

  POSTS.create(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the post.",
      });
    });
};

exports.userVote = (req, res) => {
  const votePost = req.body.vote;
  const userId = req.body.userId;
  const postId = req.params.id;
  const vote = {
    vote: votePost,
    userId: userId,
    postId: postId,
  };

  if (votePost !== "none" && votePost !== "upVote" && votePost !== "downVote") {
    return res.status(400).send({
      message: `User vote must be egual to (none / upVote / downVote) and not be : ${votePost}`,
    });
  }

  VOTES.update(req.body, {
    where: { userId, postId },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Vote was updated successfully.",
        });
      }
      VOTES.create(vote)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the vote.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err || "Some error occurred while creating the vote.",
      });
    });
};

exports.findAll = async (req, res) => {
  const orderPost = req.query.order ?? "DESC";
  const offsetPost = Number(req.query.offset) ? Number(req.query.offset) : 0;
  const limitPost = Number(req.query.limit) ? Number(req.query.limit) : 5;

  if (orderPost !== "DESC" && orderPost !== "ASC") {
    return res.status(400).send({
      message: `orderPost can only match DESC or ASC and cannot equal : ${orderPost}`,
    });
  }

  POSTS.findAll({
    order: [["createdAt", orderPost]],
    attributes: { exclude: ["userId"] },
    offset: offsetPost,
    limit: limitPost,
    include: [
      {
        model: DB.comments,
        attributes: ["id", "comment", "createdAt", "updatedAt", "userId"],
        limit: 5,
        include: [
          {
            model: DB.users,
            attributes: ["name", "description", "role"],
          },
        ],
      },
      { model: DB.users, attributes: ["name", "description", "role"] },
      {
        model: VOTES,
        required: false,
        nest: true,
        include: [
          { 
            model: DB.users,
            attributes: ["name"]
          },
        ],
        attributes: [
          "vote",
          "userId",
          // [Sequelize.literal(await countVote("upVote")), "upVote"],
          // [Sequelize.fn("COUNT", Sequelize.col("downVote")),"downtestVote"] ?? [Sequelize.literal("0"),"downtestVote"],

          // [Sequelize.where(Sequelize.fn("COUNT", Sequelize.col("downVote")),{[Op.ne]: true}),"Vottte"],

          // [Sequelize.fn("COUNT" ,Sequelize.where({where: {vote: "upVote"}})),"upppVote"],
          // [Sequelize.fn("COUNT" ,Sequelize.literal("upVote"),"upVote"),"vote"],
          // [Sequelize.literal(Sequelize.fn("COUNT", Sequelize.where({vote: "downVote"}))), "downVote"],
          // [Sequelize.literal(await countVote("upVote", "coucou")), "upVote"],
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving post.",
      });
    });
};

exports.findAllByUserId = (req, res) => {
  const offsetPost = Number(req.query.offset) ? Number(req.query.offset) : 0;
  const limitPost = Number(req.query.limit) ? Number(req.query.limit) : 5;

  POSTS.findAll({
    where: {userId: req.params.id},
    order: [["createdAt", "DESC"]],
    offset: offsetPost,
    limit: limitPost,
    attributes: { exclude: ["userId"] },
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  POSTS.findByPk(id, {
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: DB.comments,
        attributes: ["comment", "createdAt", "updatedAt"],
        include: [
          {
            model: DB.users,
            attributes: ["name", "desc", "role"],
          },
        ],
      },
      { model: DB.users, attributes: ["name", "desc", "role"] },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving post with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  POSTS.update(req.body, {
    where: { id },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Post was updated successfully.",
        });
      }
      res.send({
        message: `Cannot update post with id=${id}. Maybe post was not found or req.body is empty!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  POSTS.destroy({
    where: { id },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Post was deleted successfully!",
        });
      }

      res.send({
        message: `Cannot delete post with id=${id}. Maybe post was not found!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete post with id=" + id,
      });
    });
};
