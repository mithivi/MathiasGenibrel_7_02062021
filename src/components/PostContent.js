import React from "react";
import styled from "styled-components";
import UserImage from "./UserImg";
import { Icon } from "@iconify/react";
import cancelIcon from "@iconify-icons/iconoir/cancel";
import { getCookie } from "../utils/Cookie";

const Post = styled.div`
  margin: 1.5rem 1rem 0 1rem;
  padding: 0.5rem;
  background-color: var(--second-color);
  color: var(--primary-color);
  border-radius: 1rem;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  margin: 0.7rem 0.5rem 1.3rem 0.5rem;
`;

const UserProfilImg = styled.div`
  position: relative;
  margin-right: 1rem;
  text-align: left;
`;

const UserProfilText = styled.div`
  text-align: left;
`;

const UserProfilName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
`;

const UserPost = styled.div`
  margin-bottom: 1rem;
  text-align: left;
`;

const UserVote = styled.div`
  display: flex;
  justify-content: space-around;
`;

const UserVoteIcon = styled.div`
  display: flex;
  justify-content: space-between;
  width: 2rem;
`;

const DeletePost = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #f4f4f4;
`;

const PostContent = ({ post, onClick }) => {
  const deletePost =
    post.userId === getCookie("userId") ? (
      <Icon icon={cancelIcon} color="#f4f4f4" height="2.2rem" />
    ) : null;
  const text = post.text ? <p>{post.text}</p> : null;
  const img = post.imgUrl ? (
    <img
      src={require(`../assets/img/${post.imgUrl}`).default}
      alt={`Utilisateur : ${post.user.name}`}
    />
  ) : null;

  return (
    <Post>
      <UserInfo>
        <UserProfilImg>
          <UserImage role={post.user.role} name={post.user.name} />
        </UserProfilImg>
        <UserProfilText>
          <UserProfilName>{post.user.name}</UserProfilName>
          <span style={{ fontSize: ".9rem" }}>{post.user.description}</span>
        </UserProfilText>
      </UserInfo>
      <DeletePost
        onClick={onClick}
      >
        {deletePost}
      </DeletePost>
      <UserPost>
        {text}
        {img}
      </UserPost>
      <UserVote>
        <UserVoteIcon>
          <i className="fas fa-arrow-up"></i>
          <span>{post.upVote}</span>
        </UserVoteIcon>
        <i className="fas fa-comment"></i>
        <UserVoteIcon>
          <i className="fas fa-arrow-down"></i>
          <span>{post.downVote}</span>
        </UserVoteIcon>
      </UserVote>
    </Post>
  );
};

export default PostContent;
