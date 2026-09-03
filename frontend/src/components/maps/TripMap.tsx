export const TripMap = ({ destination }: { destination: string }) => (
  <section aria-label="Trip map">
    <b>Map</b>
    <p>
      Route map for {destination} is shown when a Google Maps key is configured.
    </p>
  </section>
);
