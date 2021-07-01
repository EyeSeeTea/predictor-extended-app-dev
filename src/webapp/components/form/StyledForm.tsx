import styled from "styled-components";

const Button = (light: string, dark: string) => styled.button`
    white-space: nowrap;
    display: inline-block;
    border-radius: 5px;
    padding: 5px 15px;
    font-size: 16px;
    color: white;
    &:visited {
        color: white;
    }
    background-image: linear-gradient(${light}, ${dark});
    border: 1px solid ${dark};
    &:hover {
        background-image: linear-gradient(${light}, ${dark});
        &[disabled] {
            background-image: linear-gradient(${light}, ${dark});
        }
    }
    &:visited {
        color: black;
    }
    &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const DefaultButton = Button("#ffffff", "#d5d5d5");

export const PrimaryButton = Button("#4f93ce", "#285f8f");

export const StyledForm = styled.form`
    padding: 40px;
`;
