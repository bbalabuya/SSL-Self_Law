import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: white;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  outline: none;
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFaSearch = styled(FaSearch)`
  position: relative;
  color: #333;
  font-size: 20px;
  right: 5px;
`;

const Results = styled.div`
  width: 70%;
  margin-top: 20px;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  align-items: flex-start; /* 검색 결과를 왼쪽 정렬 */
  max-height: 400px; /* 최대 높이 설정 */
  overflow-y: auto; /* 스크롤 가능하게 하기 */
`;

const ResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  color: black;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ResultContent = styled.div`
  max-height: 450px;
  padding: 10px;
  background-color: #f9f9f9;
  color: black;
  display: ${(props) => (props.show ? "block" : "none")};
  text-align: left; /* 내용 왼쪽 정렬 */
`;

const Message = styled.div`
  margin-top: 250px;
  font-size: 20px;
  text-align: center;
  color: white;
`;

const SearchContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.example.com/search?q=${searchQuery}`
      );
      setResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Container>
      <SearchBar>
        <Input
          type="text"
          placeholder="법 조항 또는 검색하고 싶은 내용 입력해주세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>
          <StyledFaSearch />
        </SearchButton>
      </SearchBar>
      {results.length === 0 ? (
        <Message>원하는 법을 검색하면 관련된 법 조항이 나타납니다</Message>
      ) : (
        <Results>
          {results.map((result, index) => (
            <div key={result.id}>
              <ResultItem onClick={() => toggleExpand(index)}>
                <span>{result.title}</span>
                {expandedIndex === index ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </ResultItem>
              <ResultContent show={expandedIndex === index}>
                {result.content}
              </ResultContent>
            </div>
          ))}
        </Results>
      )}
    </Container>
  );
};

export default SearchContent;
