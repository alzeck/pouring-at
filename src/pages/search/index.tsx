import Map from "google-maps-react-markers";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Marker } from "~/components/marker";
import { SearchForm } from "~/components/search-form";
import { api } from "~/utils/api";
import { getDistance } from "geolib";
import Link from "next/link";

type SearchQuery = {
  location: string;
  style: string | undefined;
  brewery: string | undefined;
};

const Search: NextPage = () => {
  const router = useRouter();
  const { location, style, brewery } = router.query as SearchQuery;
  const defaultValues = { location, style, brewery };

  const { data, isLoading, isError } = api.bars.search.useQuery(
    {
      location,
      style,
      brewery,
    },
    {
      enabled: !!location,
    }
  );

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="max-w-2xl px-4 text-2xl text-black">
          Search for your favourite beers that are pouring at bars across the UK
        </h1>
        <SearchForm defaultValues={defaultValues} />
        {isLoading && <p className="pb-4">Loading...</p>}
        {isError && <p className="pb-4">Something went wrong...</p>}
        {data && data.bars.length === 0 && (
          <p className="pb-4">No bars found, try searching again</p>
        )}
        {data && data.bars.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-2">
              {data.bars.map((bar) => (
                <div
                  key={bar.id}
                  className="flex flex-col border border-black p-4 text-slate-600"
                >
                  <span className="text-xl font-bold text-black">
                    {bar.name}
                  </span>

                  <p className="text-xs text-slate-600">
                    {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city},{" "}
                    {bar.postcode} (
                    {(
                      getDistance(
                        { latitude: bar.latitude, longitude: bar.longitude },
                        {
                          latitude: data.location.lat,
                          longitude: data.location.lng,
                        }
                      ) / 1609
                    ).toFixed(2)}{" "}
                    miles)
                  </p>

                  {bar.beverages.length > 0 && (
                    <div>
                      <p className="mt-2 text-sm font-bold text-slate-800">
                        Preview
                      </p>
                      {bar.beverages.slice(0, 4).map(({ beverage }) => (
                        <div key={beverage.id}>
                          <span className="text-xs text-slate-600">
                            {beverage.brewery.name}{" "}
                            <span className="font-bold">{beverage.name}</span> -{" "}
                            {beverage.style}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/${bar.slug}`}
                    className="mt-2 w-fit text-sm font-bold text-slate-800 underline"
                  >
                    View more
                  </Link>
                </div>
              ))}
            </div>
            <div className="h-96 w-screen py-4">
              <Map
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                defaultCenter={{
                  lng: data.location.lng,
                  lat: data.location.lat,
                }}
                defaultZoom={13}
              >
                {data.bars.map((bar) => (
                  <Marker
                    key={bar.id}
                    bar={bar}
                    lat={bar.latitude}
                    lng={bar.longitude}
                  />
                ))}
              </Map>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default Search;
