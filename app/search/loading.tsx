import Banner from 'components/banner';
import Grid from 'components/grid';
import Navbar from 'components/layout/navbar';

export default function Loading() {
  return (
    <>
      <header>
        <Banner />
        <Navbar />
      </header>
      <main className="w-full">
        <Grid className="grid-cols-2 lg:grid-cols-3">
          {Array(12)
            .fill(0)
            .map((_, index) => {
              return (
                <Grid.Item
                  key={index}
                  className="animate-pulse bg-neutral-100 dark:bg-neutral-900"
                />
              );
            })}
        </Grid>
      </main>
    </>
  );
}
