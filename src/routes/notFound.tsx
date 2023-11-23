import { router } from "core";
import { Layout } from "~/components/Layout";

router.notFound(() => {
  return (
    <Layout>
      <main class="h-screen w-screen grid place-content-center text-center bg-neutral-800 text-neutral-400">
        <h1 class="text-8xl font-thin mb-8">Not Found</h1>
      </main>
    </Layout>
  );
});
