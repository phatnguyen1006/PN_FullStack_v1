import NavBar from "../components/Layout/NavBar";
import { PostDocument, usePostQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

const Index = () => {
  const { data, loading } = usePostQuery();
  return (
    <>
      <NavBar />
      {loading ? (
        "...Loading"
      ) : (
        <ul>
          {data?.post?.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export const getStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: PostDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
};

export default Index;
