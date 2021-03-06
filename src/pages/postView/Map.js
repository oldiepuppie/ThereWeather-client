import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import MapBox from '../../components/map/MapBox';
import { changeMapPage } from '../../actions/index';

const Container = styled.div`
  background-color: var(--page-bg-color);
  width: 100%;
  position: relative;

  @media ${(props) => props.theme.viewportMin10} {
    width: 100%;
    position: relative;
  }
`;

export default function Map() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeMapPage(true));
  }, [dispatch]);

  return (
    <Container className='mapcontainer'>
      <MapBox></MapBox>
    </Container>
  );
}
