import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  age: number;
  diet: string;
  smokeStatus: string;
  quitSmokingStatus: string; // Use a single field for quit status if only one option is allowed
  packsPerDay?: number;
  yearsSmoked?: number;
  exposedToChemicals: string;
  occupation?: string;
  conditions: {
    highCholesterol: boolean;
    highBloodPressure: boolean;
    prostateInfection: boolean;
    enlargedProstate: boolean;
    prostateSurgery: boolean;
    erectileDysfunction: boolean;
    heartAttackOrStroke: boolean;
    heartDisease: boolean;
    typeOneDiabetes: boolean;
    typeTwoDiabetes: boolean;
    depression: boolean;
    prostateCancer: boolean;
  };
  prostateCancerTreatmentYear?: string;
  psaTestsCount: string;
  hadAbnormalPSA: string;
  hadProstateBiopsy: string;
  // Add the rest of the fields as per the document
};

const Form: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  // const watchSmokeStatus = watch("smokeStatus");
  const smokeStatus = watch("smokeStatus");

  const watchExposedToChemicals = watch("exposedToChemicals");
  const watchProstateCancer = watch("conditions.prostateCancer");

  const onSubmit: SubmitHandler<FormData> = data => console.log(data);

  return (
    <div className="container mx-auto p-5">
      <div className="bg-black text-white text-xl font-bold py-2 px-6 mb-4">MEDICAL HISTORY</div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        {/* Age */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">1. Please enter your age:</label>
          <input id="age" {...register('age', { required: true })} type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          {errors.age && <p className="text-red-500 text-xs italic">This question is required.</p>}
        </div>
        
        {/* Diet */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">2. Thinking about the foods you eat overall, how would you rank your diet in fat intake?</p>
          <div className="flex gap-x-2">
            {["Low", "Medium", "High"].map((option, index) => (
              <label key={index} className="inline-flex items-center custom-control">
                <input type="radio" {...register('diet', { required: true})} value={option} className="hidden" />
                <span className="control-indicator"></span>
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
          {errors.diet && <p className="text-red-500 text-xs italic">This question is required.</p>}
        </div>

      {/* Smoking Status */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">3. Do you currently smoke or have you previously been a smoker?</p>
        <div className="flex gap-x-2">
          {/* Updated class names to match the new styling */}
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('smokeStatus', { required: "This question is required" })} value="Yes" className="hidden" />
            <span className="control-indicator"></span> {/* Correct class name */}
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('smokeStatus', { required: "This question is required" })} value="No" className="hidden" />
            <span className="control-indicator"></span> {/* Correct class name */}
            <span className="ml-2">No</span>
          </label>
        </div>

      {smokeStatus === 'Yes' && (
        <>
          <p className="text-sm font-medium my-2">Please provide additional information:</p>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex gap-x-2">
              {["I quit less than 10 years ago", "I quit more than 10 years ago", "I quit more than 20 years ago", "I am a current smoker"].map((option, index) => (
                <label key={index} className="inline-flex items-center custom-control">
                  <input type="radio" {...register('quitSmokingStatus')} value={option} className="hidden" />
                  <span className="control-indicator"></span> {/* Correct class name */}
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="packsPerDay" className="block text-sm font-medium text-gray-700"> How many packs per day?</label>
              <input id="packsPerDay" {...register('packsPerDay')} type="number" className="border rounded w-full py-2 px-3 mt-1" />
            </div>
            <div>
              <label htmlFor="yearsSmoked" className="block text-sm font-medium text-gray-700">How many years have you smoked?</label>
              <input id="yearsSmoked" {...register('yearsSmoked')} type="number" className="border rounded w-full py-2 px-3 mt-1" />
            </div>
          </div>
        </>
      )}
    </div>
    {/* Hazardous Chemicals Exposure */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">4. Have you ever been exposed to hazardous chemicals known to cause cancer in your occupation?</label>
      <div className="flex gap-x-2 mt-2">
        {/* Updated class names to match the new styling */}
        <label className="inline-flex items-center custom-control">
          <input type="radio" {...register('exposedToChemicals', { required: "This question is required" })} value="Yes" className="hidden" />
          <span className="control-indicator"></span> 
          <span className="ml-2">Yes</span>
        </label>
        <label className="inline-flex items-center custom-control">
          <input type="radio" {...register('exposedToChemicals', { required: "This question is required" })} value="No" className="hidden" />
          <span className="control-indicator"></span> 
          <span className="ml-2">No</span>
        </label>
      </div>
      {watchExposedToChemicals === 'Yes' && (
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mt-4">What was the occupation?</label>
          <input id="occupation" {...register('occupation')} type="text" className="border rounded w-full py-2 px-3 mt-1" />
        </div>
      )}
    </div>

{/* Medical Conditions */}
<div className="mb-4">
  <p className="text-sm font-medium mb-2">5. Have you ever had any of the following conditions?</p>
  <div className="-mx-2">
    {/* Row 1 */}
    <div className="flex flex-wrap mb-4">
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.highCholesterol')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">High Cholesterol</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.highBloodPressure')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">High Blood Pressure</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.prostateInfection')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Prostate Infection</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.enlargedProstate')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Enlarged Prostate</span>
      </label>
      {/* ... other labels for the first row */}
      {/* Repeat for each condition in the first row */}
    </div>
    
    {/* Row 2 */}
    <div className="flex flex-wrap mb-4">
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.prostateSurgery')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Prostate Surgery</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.erectileDysfunction')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Erectile Dysfunction or Sexual Problems</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.heartAttackOrStroke')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Heart Attack or Stroke</span>
      </label>
      {/* Repeat for each condition in the second row */}
    </div>
    
    {/* Row 3 */}
    <div className="flex flex-wrap mb-4">
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.heartDisease')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Heart Disease</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.typeOneDiabetes')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Type I (Childhood) Diabetes</span>
      </label>
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.typeTwoDiabetes')} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Type II (Adult) Diabetes</span>
      </label>
      {/* Repeat for each condition in the third row */}
    </div>
    
    {/* Row 4 */}
    <div className="flex flex-wrap mb-4">
      <label className="inline-flex items-center custom-control px-2">
        <input type="checkbox" {...register('conditions.depression', { required: "This question is required" })} className="hidden" />
        <span className="control-indicator"></span>
        <span className="ml-2">Depression</span>
      </label>
      {/* Prostate Cancer Checkbox with Conditional Input */}
      <label className="inline-flex items-center custom-control px-2">
        <input 
          type="checkbox" 
          {...register('conditions.prostateCancer')} 
          className="hidden" 
        />
        <span className="control-indicator"></span>
        <span className="ml-2">Prostate Cancer</span>
      </label>
      {watchProstateCancer && (
        <input 
          type="text" 
          {...register('prostateCancerTreatmentYear')} 
          placeholder="Year of treatment" 
          className="border rounded px-3 py-1" // Style as needed
        />
      )}
      {/* Repeat for each condition in the fourth row */}

    </div>
    {/* More rows can be added in the same manner */}
  </div>
</div>



     {/* PSA Tests */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">6. How many PSA tests have you had in the past 3 years?</p>
        <div className="flex gap-x-2">
          {["None", "1-3", "4-6", "7+"].map((option, index) => (
            <label key={index} className="inline-flex items-center custom-control">
              <input type="radio" {...register('psaTestsCount')} value={option} className="hidden" />
              <span className="control-indicator"></span>               
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>


        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
export default Form;
