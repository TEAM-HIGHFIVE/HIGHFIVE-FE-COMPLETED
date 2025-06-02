import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import {
  Signup,
  Login,
  Home,
  ServiceList,
  ServiceDetail,
  ReviewQA,
  BoardDetail,
} from '@pages/index';

const App = () => (
  <Router>
    <Container>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<ServiceList />} />
        <Route path="/service/:welfareNo" element={<ServiceDetail />} />
        <Route path="/review" element={<ReviewQA />} />
        <Route path="/post/:postNo" element={<BoardDetail />} />
      </Routes>
    </Container>
  </Router>
);

export default App;

const Container = styled.div`
  width: 100%;
  height: 97vh;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: #fff;

  // 텍스트 클릭 방지
  user-select: none;
`;
