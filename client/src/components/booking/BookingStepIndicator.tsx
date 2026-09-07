interface BookingStepIndicatorProps {
  currentStep: number;
}

export default function BookingStepIndicator({ currentStep }: BookingStepIndicatorProps) {
  if (currentStep >= 4) return null;

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {[1, 2, 3].map((num) => (
        <div
          key={num}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            currentStep >= num
              ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}
