'use client';

type ErrorProps = {
  error: Error;
};

function Error({ error }: ErrorProps) {
  return (
    <div>
      <h2>Error</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default Error;
