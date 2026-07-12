import DailySchedule from "./DailySchedule";
import WeeklySchedule from "./WeeklySchedule";
import MonthlySchedule from "./MonthlySchedule";


export default function SubscriptionSchedule({
  frequencyId,
  control,
  register,
  errors,
  watch,
}) {
  if (!frequencyId) {
    return null;
  }

  let component = null;

  switch (Number(frequencyId)) {
    // Daily
    case 1:
      component = (
        <DailySchedule
          frequencyId={frequencyId}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
        />
      );
      break;

    // Weekly
    case 2:
      component = (
        <WeeklySchedule
          frequencyId={frequencyId}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
        />
      );
      break;

    // Monthly
    case 3:
      component = (
        <MonthlySchedule
          frequencyId={frequencyId}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
        />
      );
      break;

    // Interval
    case 4:
      component = (
        <DailySchedule
          frequencyId={frequencyId}
          control={control}
          register={register}
          errors={errors}
          watch={watch}
        />
      );
      break;

    default:
      return null;
  }

  return (
    <>
      {errors?.schedules?.root?.message && (
        <p className="mb-4 text-sm text-red-500">
          {errors.schedules.root.message}
        </p>
      )}

      {component}
    </>
  );
}