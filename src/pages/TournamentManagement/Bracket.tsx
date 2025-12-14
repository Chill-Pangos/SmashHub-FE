export default function TournamentBracket() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-card-foreground">
          Tournament Brackets
        </h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Spring Championship 2024 - Bracket
          </h3>

          {/* Bracket Visualization */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full p-4 bg-background rounded-lg border border-border">
              <div className="flex justify-between items-start gap-8">
                {/* Round 1 */}
                <div className="flex flex-col gap-8">
                  <div className="border border-border rounded p-2 bg-accent min-w-32">
                    <p className="text-xs font-medium text-card-foreground">
                      Player 1
                    </p>
                  </div>
                  <div className="border border-border rounded p-2 bg-accent min-w-32">
                    <p className="text-xs font-medium text-card-foreground">
                      Player 2
                    </p>
                  </div>
                </div>

                {/* Round 2 */}
                <div className="flex flex-col gap-16 justify-center">
                  <div className="border border-border rounded p-2 bg-primary/20 min-w-32">
                    <p className="text-xs font-medium text-card-foreground">
                      Winner 1
                    </p>
                  </div>
                  <div className="border border-border rounded p-2 bg-accent min-w-32">
                    <p className="text-xs font-medium text-card-foreground">
                      TBD
                    </p>
                  </div>
                </div>

                {/* Finals */}
                <div className="flex flex-col gap-24 justify-center">
                  <div className="border border-primary rounded p-2 bg-primary/10 min-w-32">
                    <p className="text-sm font-bold text-primary">Finals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            Bracket will update as matches progress
          </p>
        </div>
      </div>
    </div>
  );
}
