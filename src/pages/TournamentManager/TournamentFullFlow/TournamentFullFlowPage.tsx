import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FlowPhaseTabs,
  FlowStepCard,
} from "@/components/custom/tournament-flow";
import { useTranslation } from "@/hooks/useTranslation";
import { useTournamentFlowSnapshot } from "@/hooks/queries";
import { tournamentLifecycleFlow } from "./config/lifecycleFlow";
import type { TournamentFlowPhaseId } from "./types";
import PhaseStepNavigator from "./components/PhaseStepNavigator";

export default function TournamentFullFlowPage() {
  const { t } = useTranslation();
  const [activePhaseId, setActivePhaseId] =
    useState<TournamentFlowPhaseId>("setup");
  const [activeStepId, setActiveStepId] = useState(
    tournamentLifecycleFlow[0].steps[0].id,
  );
  const [tournamentIdInput, setTournamentIdInput] = useState("");
  const [categoryIdInput, setCategoryIdInput] = useState("");

  const selectedTournamentId = Number.parseInt(tournamentIdInput, 10);
  const selectedCategoryId = Number.parseInt(categoryIdInput, 10);

  const snapshot = useTournamentFlowSnapshot({
    tournamentId: Number.isNaN(selectedTournamentId)
      ? undefined
      : selectedTournamentId,
    categoryId: Number.isNaN(selectedCategoryId)
      ? undefined
      : selectedCategoryId,
    enabled: true,
  });

  const metricLabels = useMemo(
    () => ({
      tournaments: t("tournamentManager.fullFlow.snapshot.tournaments"),
      referees: t("tournamentManager.fullFlow.snapshot.referees"),
      entries: t("tournamentManager.fullFlow.snapshot.entries"),
      schedules: t("tournamentManager.fullFlow.snapshot.schedules"),
      pendingMatches: t("tournamentManager.fullFlow.snapshot.pendingMatches"),
      groupStandings: t("tournamentManager.fullFlow.snapshot.groupStandings"),
      knockoutBrackets: t(
        "tournamentManager.fullFlow.snapshot.knockoutBrackets",
      ),
      qualifiedTeams: t("tournamentManager.fullFlow.snapshot.qualifiedTeams"),
    }),
    [t],
  );

  const phaseItems = useMemo(
    () =>
      tournamentLifecycleFlow.map((phase) => ({
        id: phase.id,
        label: t(phase.titleKey),
        description: t(phase.descriptionKey),
        stepCount: phase.steps.length,
        accentClass: phase.colorClass,
      })),
    [t],
  );

  const activePhase = useMemo(
    () =>
      tournamentLifecycleFlow.find((phase) => phase.id === activePhaseId) ||
      tournamentLifecycleFlow[0],
    [activePhaseId],
  );

  const activePhaseSteps = activePhase.steps;

  useEffect(() => {
    const activeStepExists = activePhaseSteps.some(
      (step) => step.id === activeStepId,
    );

    if (!activeStepExists && activePhaseSteps.length > 0) {
      setActiveStepId(activePhaseSteps[0].id);
    }
  }, [activePhaseSteps, activeStepId]);

  return (
    <div className="p-6 space-y-6">
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-background">
          <CardTitle className="text-2xl">
            {t("tournamentManager.fullFlow.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("tournamentManager.fullFlow.description")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">
              {t("tournamentManager.fullFlow.meta.docsBased")}
            </Badge>
            <Badge variant="outline">
              {t("tournamentManager.fullFlow.meta.organizerFlow")}
            </Badge>
            <Badge variant="outline">
              {t("tournamentManager.fullFlow.meta.endToEnd")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
            <Input
              type="number"
              value={tournamentIdInput}
              onChange={(event) => setTournamentIdInput(event.target.value)}
              placeholder={t("tournamentManager.fullFlow.filters.tournamentId")}
            />
            <Input
              type="number"
              value={categoryIdInput}
              onChange={(event) => setCategoryIdInput(event.target.value)}
              placeholder={t("tournamentManager.fullFlow.filters.categoryId")}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void snapshot.refetchAll();
              }}
            >
              {snapshot.isFetching
                ? t("tournamentManager.fullFlow.filters.refreshing")
                : t("tournamentManager.fullFlow.filters.refresh")}
            </Button>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-lg border bg-card px-4 py-3"
              >
                <p className="text-xs text-muted-foreground">
                  {metricLabels[metric.id as keyof typeof metricLabels]}
                </p>
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {snapshot.tournamentName ? (
              <Badge variant="secondary">{snapshot.tournamentName}</Badge>
            ) : null}
            {snapshot.isLoading ? (
              <span>{t("tournamentManager.fullFlow.snapshot.loading")}</span>
            ) : null}
            {snapshot.hasError ? (
              <span className="text-destructive">
                {t("tournamentManager.fullFlow.snapshot.error", {
                  count: snapshot.errorCount,
                })}
              </span>
            ) : null}
          </div>

          <FlowPhaseTabs
            phases={phaseItems}
            activePhaseId={activePhase.id}
            onChange={(phaseId) => {
              setActivePhaseId(phaseId as TournamentFlowPhaseId);
              const nextPhase = tournamentLifecycleFlow.find(
                (phase) => phase.id === phaseId,
              );
              if (nextPhase?.steps[0]) {
                setActiveStepId(nextPhase.steps[0].id);
              }
            }}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <PhaseStepNavigator
          title={t("tournamentManager.fullFlow.labels.steps")}
          steps={activePhaseSteps.map((step) => ({
            id: step.id,
            label: t(step.titleKey),
          }))}
          activeStepId={activeStepId}
          onChange={setActiveStepId}
        />

        <section className="space-y-4">
          {activePhaseSteps.map((step, index) => (
            <FlowStepCard
              key={step.id}
              step={step}
              index={index}
              isHighlighted={step.id === activeStepId}
              title={t(step.titleKey)}
              description={t(step.descriptionKey)}
              actorLabel={t(step.actorKey)}
              prerequisiteLabels={(step.prerequisites ?? []).map((key) =>
                t(key),
              )}
              prerequisitesTitle={t(
                "tournamentManager.fullFlow.labels.prerequisites",
              )}
              autoTriggerLabels={(step.autoTriggers ?? []).map((key) => t(key))}
              autoTriggersTitle={t(
                "tournamentManager.fullFlow.labels.autoTriggers",
              )}
              apiCountLabel={t("tournamentManager.fullFlow.labels.apis")}
              expandLabel={t("tournamentManager.fullFlow.labels.expandStep")}
              collapseLabel={t(
                "tournamentManager.fullFlow.labels.collapseStep",
              )}
              autoBadgeLabel={t("tournamentManager.fullFlow.labels.auto")}
              tipLabel={step.tipKey ? t(step.tipKey) : undefined}
              translateNote={t}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
