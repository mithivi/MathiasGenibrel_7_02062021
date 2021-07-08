import React from "react";
import styled from "styled-components";

const DeleteIcon = styled.svg`
  position: relative;
  right: 0;
  bottom: 0;
  color: var(--second-color);
`;

const DeleteLogo = ({
  height = "1.4rem",
}) => {
  return (
    <>
      <DeleteIcon
        height={height}
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="trash"
        className="svg-inline--fa fa-trash fa-w-14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
        ></path>
      </DeleteIcon>
    </>
  );
};

export default DeleteLogo;
