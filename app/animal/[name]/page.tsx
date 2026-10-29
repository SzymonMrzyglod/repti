import { notFound } from "next/navigation";
import AnimalDetail from "@/components/animal-detail";
import { reptileByIdQuery, sanityClient } from "@/lib/sanity";

type Params = { params: Promise<{ name: string }> };

export default async function AnimalPage({ params }: Params) {
  const { name: id } = await params;
  const animal = await sanityClient.fetch(reptileByIdQuery, { id });
  if (!animal) notFound();
  const imageUrl =
    animal.imageUrl ||
    (animal.latinName?.includes("Pantherophis")
      ? "/images/snake-ember.png"
      : "/images/gecko-luna.png");
  return <AnimalDetail animal={{ ...animal, imageUrl }} />;
}
