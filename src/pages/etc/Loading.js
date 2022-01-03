import styled from 'styled-components';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: ${(props) => (props.hide ? 'none' : 'flex')};
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  background-color: rgba(253, 254, 254, 0.5);
  z-index: 300;

  & > img {
    margin-top: calc(var(--mobile-header-height) + 10vh);

    @media ${(props) => props.theme.viewportMin10} {
      margin-top: calc(var(--desktop-header-height) + 10vh);
    }
  }
`;

export default function Loading({ size, duration, hide }) {
  return (
    <LoadingContainer className='loadingContainer' hide={hide}>
      <LoadingSpinner size={size} duration={duration} />
    </LoadingContainer>
  );
}
