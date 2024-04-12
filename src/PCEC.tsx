import React from 'react';
import { useEffect } from 'react';
import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


type ErrorMessageProps = {
  errors: FieldErrors;
  name: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, name }) => {
  return errors[name] ? (
    <p className="error-message text-red-500 text-xs italic">
      {'This question is required'}
    </p>
  ) : null;
};


type FamilyHistoryDisease = 'prostateCancer' | 'breastCancer' | 'colonCancer' | 'lynchSyndrome' | 'melanoma' | 'ovarianCancer' | 'pancreaticCancer' | 'heartDisease' | 'diabetes';

type FamilyMember = 'father' | 'mother' | 'brother' | 'sister' | 'aunt' | 'uncle' | 'grandfather' | 'grandmother';

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
  hadAbnormalExam: string; // Yes or No
  prostateBiopsy: string; 
  noBiopsyReason: {
    didntKnow: boolean;
    decidedNotTo: boolean;
    couldNotAfford: boolean;
    afraid: boolean;
    cameBackForTest: boolean;
    normalPSA: boolean;
    notImportant: boolean;
    diagnosedBPH: boolean;
  }; 
  raceEthnicity: string;
  familyHistory: Record<FamilyHistoryDisease, Record<FamilyMember, boolean>>;

};

const diseases = {
  prostateCancer: 'Prostate Cancer',
  breastCancer: 'Breast Cancer',
  colonCancer: 'Colon Cancer',
  lynchSyndrome: 'Lynch Syndrome',
  melanoma: 'Melanoma',
  ovarianCancer: 'Ovarian Cancer',
  pancreaticCancer: 'Pancreatic Cancer',
  heartDisease: 'Heart Disease',
  diabetes: 'Diabetes',
};

const relatives = {
  father: 'Father',
  mother: 'Mother',
  brother: 'Brother(s)',
  sister: 'Sister(s)',
  aunt: 'Aunt(s)',
  uncle: 'Uncle(s)',
  grandfather: 'Grandfather(s)',
  grandmother: 'Grandmother(s)',
};


const Form: React.FC = () => {
  const { register, handleSubmit, watch, reset, formState: { errors }, getValues} = useForm<FormData>();
  const watchSmokeStatus = watch("smokeStatus");
  const watchExposedToChemicals = watch("exposedToChemicals");
  const watchProstateCancer = watch("conditions.prostateCancer");

  const mutation = useMutation<any, Error, FormData>({
    mutationFn: async (data) => {
      console.log(data)
      return await axios.post(process.env.NODE_ENV == 'production' ? 'https://pcec.biolinkanalytics.com/patient' : 'http://127.0.0.1:5000/patient', data)
    },
    onSuccess: (res) => {
      console.log(res)
    },
    onError: (err) => {
      console.log(err)
    },
  })

  useEffect(() => {
    // If user changes from "Yes" to "No", reset the related fields
    if (watchSmokeStatus === 'No') {
      reset({
        ...getValues(), // Preserve the values for other fields
        quitSmokingStatus: undefined,
        packsPerDay: undefined,
        yearsSmoked: undefined,
        // Reset other related fields as necessary
      }, {
        keepErrors: false, // Remove the errors
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
    }
  }, [watchSmokeStatus, reset]);

  useEffect(() => {
    // If user changes from "Yes" to "No" for chemical exposure, reset the occupation field
    if (watchExposedToChemicals === 'No') {
      reset({
        ...getValues(), // Preserve the values for other fields
        occupation: undefined, // Reset 'occupation'
      }, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
    }
  }, [watchExposedToChemicals, reset, getValues]);
  
  return (
    <div className="container mx-auto p-5">
      <div className="bg-black text-white text-xl font-bold py-2 px-6 mb-4">MEDICAL HISTORY</div>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        {/* Age */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">1. Please enter your age:</label>
          <input id="age" {...register('age', { required: true })} type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <ErrorMessage errors={errors} name="age" />
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
          <ErrorMessage errors={errors} name="diet" />
        </div>

      {/* Smoking Status */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">3. Do you currently smoke or have you previously been a smoker?</p>
        <div className="flex gap-x-2">
          {/* Updated class names to match the new styling */}
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('smokeStatus', { required: true })} value="Yes" className="hidden" />
            <span className="control-indicator"></span> {/* Correct class name */}
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('smokeStatus', { required: "This question is required" })} value="No" className="hidden" />
            <span className="control-indicator"></span> {/* Correct class name */}
            <span className="ml-2">No</span>
          </label>
        </div>
        <ErrorMessage errors={errors} name="smokeStatus" />
      {watchSmokeStatus === 'Yes' && (
        <>
          <p className="text-sm font-medium my-2">Please provide additional information:</p>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex gap-x-2 -mb-4">
              {["I quit less than 10 years ago", "I quit more than 10 years ago", "I quit more than 20 years ago", "I am a current smoker"].map((option, index) => (
                <label key={index} className="inline-flex items-center custom-control">
                  <input type="radio" {...register('quitSmokingStatus', { required: watchSmokeStatus === 'Yes' })} 
                    value={option} 
                    className="hidden" />
                  <span className="control-indicator"></span> {/* Correct class name */}
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
            <ErrorMessage errors = {errors} name="quitSmokingStatus"/>
            <div className="mt-4 -mb-4">
              <label htmlFor="packsPerDay" className="block text-sm font-medium text-gray-700"> How many packs per day?</label>
              <input id="packsPerDay" {...register('packsPerDay', { required: watchSmokeStatus === 'Yes' })} type="number" className="border rounded w-full py-2 px-3 mt-1" />
            </div>
            <ErrorMessage errors = {errors} name="packsPerDay"/>
            <div className="mt-4 -mb-4">
              <label htmlFor="yearsSmoked" className="block text-sm font-medium text-gray-700">How many years have you smoked?</label>
              <input id="yearsSmoked" {...register('yearsSmoked', { required: watchSmokeStatus === 'Yes' })} type="number" className="border rounded w-full py-2 px-3 mt-1" />
            </div>
            <ErrorMessage errors = {errors} name="yearsSmoked"/>
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
          <input type="radio" {...register('exposedToChemicals', { required: true })} value="Yes" className="hidden" />
          <span className="control-indicator"></span> 
          <span className="ml-2">Yes</span>
        </label>
        <label className="inline-flex items-center custom-control">
          <input type="radio" {...register('exposedToChemicals', { required: true })} value="No" className="hidden" />
          <span className="control-indicator"></span> 
          <span className="ml-2">No</span>
        </label>
      </div>
      <ErrorMessage errors = {errors} name="exposedToChemicals"/>
      {watchExposedToChemicals === 'Yes' && (
        <>
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mt-4">What was the occupation?</label>
          <input id="occupation" {...register('occupation', {required: watchExposedToChemicals === 'Yes'})} type="text" className="border rounded w-full py-2 px-3 mt-1" />
        </div>
        <ErrorMessage errors = {errors} name="occupation"/>
        </>
      )}

    </div>

{/* Medical Conditions */}
<div className="mt-4 mb-4">
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
        <input type="checkbox" {...register('conditions.depression')} className="hidden" />
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

    </div>
  </div>
</div>

     {/* PSA Tests */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">6. How many PSA tests have you had in the past 3 years?</p>
        <div className="flex gap-x-2">
          {["None", "1-3", "4-6", "7+"].map((option, index) => (
            <label key={index} className="inline-flex items-center custom-control">
              <input type="radio" {...register('psaTestsCount', {required: true})} value={option} className="hidden" />
              <span className="control-indicator"></span>               
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        <ErrorMessage errors = {errors} name = "psaTestsCount"/>
      </div>

      {/* Question 7 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">7. Have you previously had an ABNORMAL rectal exam or PSA test?</label>
        <div className="flex gap-x-2">
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('hadAbnormalExam', { required: true })} value="Yes" className="hidden" />
            <span className="control-indicator"></span>
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center custom-control">
            <input type="radio" {...register('hadAbnormalExam', { required: true })} value="No" className="hidden" />
            <span className="control-indicator"></span>
            <span className="ml-2">No</span>
          </label>
        </div>
        <ErrorMessage errors={errors} name="hadAbnormalExam" />
      </div>

          {/* Question 8 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            8. Did you receive a prostate biopsy as a part of your follow-up?
          </label>
          <div className="flex flex-col">
            <label className="inline-flex items-center custom-control mb-2">
              <input
                type="radio"
                {...register('prostateBiopsy', { required: "This question is required" })}
                value="I did not receive a prostate biopsy"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">I did not receive a prostate biopsy</span>
            </label>
            <label className="inline-flex items-center custom-control mb-2">
              <input
                type="radio"
                {...register('prostateBiopsy', { required: "This question is required" })}
                value="The biopsy was negative/no cancer"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">The biopsy was negative/no cancer</span>
            </label>
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register('prostateBiopsy', { required: "This question is required" })}
                value="The biopsy was positive/I was diagnosed with cancer"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">The biopsy was positive/I was diagnosed with cancer</span>
            </label>
          </div>
          <ErrorMessage errors={errors} name="prostateBiopsy" />
        </div>
     {/* Question 9 */}
     <div className="mt-4 mb-4">
        <p className="text-sm font-medium mb-2">
          9. If you did NOT receive a prostate biopsy during follow-up, why not?
        </p>
        <div className="-mx-2">
          {/* Row 1 */}
          <div className="flex flex-wrap mb-2">
            {/* Map out the checkboxes for row 1 */}
            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.didntKnow')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Didn’t know I was supposed to</span>
            </label>

            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.notImportant')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Didn't think it was important</span>
            </label>


            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.afraid')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Afraid to find out if I had cancer</span>
            </label>

          </div>
          {/* Row 2 */}
          <div className="flex flex-wrap mb-2">
            {/* Map out the checkboxes for row 2 */}
            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.decidedNotTo')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Dr. decided not to</span>
            </label>

            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.couldNotAfford')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Could not afford to</span>
            </label>

            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.cameBackForTest')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">I came back to PCAW for repeat test</span>
            </label>
           
          </div>
          {/* Row 3 */}
          <div className="flex flex-wrap mb-4">
            {/* Map out the checkbox for row 3 */}
            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.diagnosedBPH')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">I was diagnosed with BPH or Enlarged Prostate (EP) at follow-up</span>
            </label>
            <label className="inline-flex items-center custom-control px-2">
              <input
                type="checkbox"
                {...register('noBiopsyReason.normalPSA')}
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Repeat PSA was normal</span>
            </label>
          </div>
        </div>
      </div>
     {/* Family History */}

<div className="mb-4">
  <p className="text-sm font-medium mb-2">
    10. Do you have a close biological relative that has been diagnosed with any of the following diseases:
  </p>

  <div className="flex mb-2">
  <div className="w-1/4"></div> {/* Placeholder for the disease names */}
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-3.8rem" }}>Father</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-0.5rem" }}>Mother</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "3.5rem" }}>Brother(s)</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-0rem" }}>Sister(s)</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-0.5rem" }}>Aunt(s)</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-0.25rem" }}>Uncle(s)</div>
  <div className="flex-1 text-center font-medium" style={{ marginLeft: "-0.25rem" }}>Grandfather(s)</div>
  <div className="flex-1 text-center font-medium" style={{ marginRight: "-0.75rem" }}>Grandmother(s)</div>
</div>

{Object.entries(diseases).map(([diseaseKey, diseaseValue], index) => (
  <div key={index} className="flex items-center mb-4">
    <span className="w-1/4 font-medium">{diseaseValue}</span>
    {Object.keys(relatives).map((relativeKey, relativeIndex) => {
      const isParent = relativeKey === 'father' || relativeKey === 'mother';
      const baseName = `familyHistory.${diseaseKey}.${relativeKey}`;

      return (
        <div key={relativeKey} className={`flex-1 ${!isParent ? 'flex justify-center space-x-2' : ''}`}>
          {!isParent ? (
            <div className="flex justify-center space-x-2"> {/* Apply horizontal space between checkboxes */}
              {[...Array(2)].map((_, checkboxIndex) => {
                const name = `${baseName}[${checkboxIndex}]`;
                return (
                  <label key={checkboxIndex} className="inline-flex justify-center items-center custom-control">
                    <input
                      type="checkbox"
                      {...register(name as keyof FormData)}
                      className="opacity-0 z-10"
                      style={{ width: '16px', height: '16px' }} // Adjust this if necessary
                      id={`${baseName}-${checkboxIndex}-${index}-${relativeIndex}`}
                    />
                    <span className="control-indicator"></span>
                  </label>
                );
              })}
            </div>
          ) : (
            <label className="inline-flex justify-center items-center custom-control">
              <input
                type="checkbox"
                {...register(baseName as keyof FormData)}
                className="opacity-0 z-10"
                style={{ width: '16px', height: '16px' }} // Adjust this if necessary
                id={`${baseName}-0-${index}`}
              />
              <span className="control-indicator"></span>
            </label>
          )}
        </div>
      );
    })}
  </div>
))}




</div>



          

            
        {/* Race/Ethnicity */}
        <div className="mb-4">
        <p className="text-sm font-medium mb-2">
          11. What race/ethnicity best describes you?
        </p>
        <div className="flex gap-x-2">
          {["White", "Hispanic", "Black", "Asian", "Native American", "Hawaiian or Pacific Islander", "Other"].map((option) => (
            <label key={option} className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register('raceEthnicity', { required: true })}
                value={option}
                className="hidden"
                id={`raceEthnicity-${option}`}
              />
              <span className="control-indicator"></span>
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
        <ErrorMessage errors={errors} name="raceEthnicity" />

{/* ... rest of your form ... */}

      </div>
        <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
export default Form;
