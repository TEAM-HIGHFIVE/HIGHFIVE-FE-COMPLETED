/*
 * 복지 서비스 목록 페이지 (2-1)
 */

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Header } from '@components/common';
import { IoSearch } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Item, Pagination } from '@components/index';
import { regionMap, targetMap } from '@constants/filters';
import { requestGetFetch } from '@services/apiService';
import { searchServiceData } from '@constants/dummy';

const ServiceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    region: passedRegion = [],
    target: passedTarget = [],
    input: passedInput = '',
  } = (location.state as {
    region: string[];
    target: string[];
    input: string;
  }) || {};

  const [inputText, setInputText] = useState(passedInput);
  const [serviceList, setServiceList] = useState<
    { welfareNo: string; title: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchWelfareList = async () => {
    try {
      const params = new URLSearchParams();

      if (passedRegion.length > 0) {
        const mappedArea = regionMap[passedRegion[0]];
        if (mappedArea) params.append('area', mappedArea);
      }

      if (passedTarget.length > 0) {
        const mappedTarget = targetMap[passedTarget[0]];
        if (mappedTarget) params.append('target', mappedTarget);
      }

      if (!inputText.trim()) return;
      params.append('question', inputText.trim());

      const response = await requestGetFetch(
        `api/welfare?${params.toString()}`,
      );
      setServiceList(response.result || []);
    } catch (err) {
      console.error('복지 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchWelfareList();
    const filtered = searchServiceData
      .filter(service =>
        service.title.toLowerCase().includes(inputText.toLowerCase().trim()),
      )
      .map((item, index) => ({
        welfareNo: `${index + 1}`,
        title: item.title,
      }));

    setServiceList(filtered);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(serviceList.length / itemsPerPage);
  const currentItems = serviceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSearch = () => {
    const filtered = searchServiceData
      .filter(service =>
        service.title.toLowerCase().includes(inputText.toLowerCase().trim()),
      )
      .map((item, index) => ({
        welfareNo: `${index + 1}`,
        title: item.title,
      }));

    setServiceList(filtered);
    setCurrentPage(1);
    fetchWelfareList();
  };

  return (
    <Container>
      <Header backIcon={true} />
      <ContentContainer>
        <Card style={{ width: '100%' }}>
          <SearchBox>
            <Input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="ex) 성남에 거주 중인 20대 남자야. 교통사고로 하반신 마비를 갖게 됐어. 받을 수 있는 혜택이 있을까?"
            />
            <IoSearch
              size={24}
              style={{ cursor: 'pointer' }}
              onClick={handleSearch}
            />
          </SearchBox>

          <InfoRow>
            <InfoBox>
              <LabelText>거주 지역</LabelText>
              <ContentText>
                {passedRegion.length > 0
                  ? passedRegion.join(', ')
                  : '선택된 지역이 없습니다.'}
              </ContentText>
            </InfoBox>
            <InfoBox>
              <LabelText>지원 대상</LabelText>
              <ContentText>
                {passedTarget.length > 0
                  ? passedTarget.join(', ')
                  : '선택된 대상이 없습니다.'}
              </ContentText>
            </InfoBox>
          </InfoRow>
        </Card>

        <Label>추천 서비스</Label>
        <Card style={{ width: '100%' }}>
          <List>
            {currentItems.map(item => (
              <Item
                key={item.welfareNo}
                title={item.title}
                onClick={() => navigate(`/service/${item.welfareNo}`)}
              />
            ))}
          </List>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </ContentContainer>
    </Container>
  );
};

export default ServiceList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 22rem;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px #ccc;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: white;
  padding: 1.5rem 5rem;
  border-radius: 1rem;
  box-sizing: border-box;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
`;

const LabelText = styled.div`
  font-weight: bold;
`;

const ContentText = styled.div`
  color: #333;
`;

const Label = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
