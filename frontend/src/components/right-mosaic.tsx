export function Mosaic() {
  return (
    <div className="relative hidden lg:block p-4 min-h-screen overflow-hidden">
      <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
        {[
          ["0%", "0%"],
          ["33.33%", "0%"],
          ["66.66%", "0%"],
          ["100%", "0%"],
          ["0%", "33.33%"],
          ["33.33%", "33.33%"],
          ["66.66%", "33.33%"],
          ["100%", "33.33%"],
          ["0%", "66.66%"],
          null,
          null,
          null,
          ["0%", "100%"],
          ["33.33%", "100%"],
          ["66.66%", "100%"],
          ["100%", "100%"],
        ].map((pos, i) => {
          if (i === 9)
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-primary p-4"
              >
                <h3 className="font-bold text-primary-foreground">
                  Innovative Design
                </h3>
                <p className="text-sm text-primary-foreground mt-1">
                  Harness the power of AI for cutting-edge 3D creations.
                </p>
              </div>
            );
          if (i === 10)
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-[var(--chart-4)] p-4"
              >
                <h3 className="font-bold text-foreground">Customization</h3>
                <p className="text-sm text-foreground mt-1">
                  Tailor every aspect of your 3D object to your specifications.
                </p>
              </div>
            );
          if (i === 11)
            return (
              <div key={i} className="rounded-2xl overflow-hidden bg-primary" />
            );

          const [x, y] = pos || ["0%", "0%"];
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-black relative"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/2316400/pexels-photo-2316400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
                  backgroundSize: "390% 400%",
                  backgroundPosition: `${x} ${y}`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
