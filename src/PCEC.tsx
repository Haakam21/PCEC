import React from "react";
import { useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Logo from './Logo';

type ErrorMessageProps = {
  errors: FieldErrors;
  name: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, name }) => {
  return errors[name] ? (
    <p className="error-message text-red-500 text-xs">
      {"This question is required"}
    </p>
  ) : null;
};

type FamilyHistoryDisease =
  | "prostateCancer"
  | "breastCancer"
  | "colonCancer"
  | "lynchSyndrome"
  | "melanoma"
  | "ovarianCancer"
  | "pancreaticCancer"
  | "heartDisease"
  | "diabetes";

type FamilyMember =
  | "father"
  | "mother"
  | "brother"
  | "sister"
  | "aunt"
  | "uncle"
  | "grandfather"
  | "grandmother";

type ParticipantInfo = {
  lastName: string;
  firstName: string;
  middleInitial?: string;
  address: string;
  aptNumber?: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  dob: string;
  email: string;
  waistSize: number;
  weight: number;
  heightFeet: number;
  heightInches: number;
  bloodDrawMinute: number;
  bloodDrawHour: number;
  bloodDrawAmPm: string;
  fastingStatus: string; // "Yes" or "No"
  signature: string;
  signatureDate: string;
};
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
} & ParticipantInfo;

const diseases = {
  prostateCancer: "Prostate Cancer",
  breastCancer: "Breast Cancer",
  colonCancer: "Colon Cancer",
  lynchSyndrome: "Lynch Syndrome",
  melanoma: "Melanoma",
  ovarianCancer: "Ovarian Cancer",
  pancreaticCancer: "Pancreatic Cancer",
  heartDisease: "Heart Disease",
  diabetes: "Diabetes",
};

const relatives = {
  father: "Father",
  mother: "Mother",
  brother: "Brother(s)",
  sister: "Sister(s)",
  aunt: "Aunt(s)",
  uncle: "Uncle(s)",
  grandfather: "Grandfather(s)",
  grandmother: "Grandmother(s)",
};

const Form: React.FC<{english?: boolean}> = ({english = true}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>();
  const watchSmokeStatus = watch("smokeStatus");
  const watchExposedToChemicals = watch("exposedToChemicals");
  const watchProstateCancer = watch("conditions.prostateCancer");
  const watchHadAbnormalExam = watch("hadAbnormalExam");
  const watchProstateBiopsy = watch("prostateBiopsy");

  const navigate = useNavigate();
  
  const mutation = useMutation<any, Error, FormData>({
    mutationFn: async (data) => {
      console.log(data)
      return await axios.post(process.env.NODE_ENV == 'production' ? 'https://pcec.biolinkanalytics.com/patient' : 'http://127.0.0.1:5000/patient', data)
    },
    onSuccess: (res) => {
      console.log(res)
      navigate(`/code/${res.data.code}`)
    },
    onError: (err) => {
      console.log(err)
      throw err
    },
  })

  useEffect(() => {
    // If user changes from "Yes" to "No", reset the related fields
    if (watchSmokeStatus === "No") {
      reset(
        {
          ...getValues(), // Preserve the values for other fields
          quitSmokingStatus: undefined,
          packsPerDay: undefined,
          yearsSmoked: undefined,
          // Reset other related fields as necessary
        },
        {
          keepErrors: false, // Remove the errors
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepSubmitCount: false,
        }
      );
    }
  }, [watchSmokeStatus, reset]);

  useEffect(() => {
    // If user changes from "Yes" to "No" for chemical exposure, reset the occupation field
    if (watchExposedToChemicals === "No") {
      reset(
        {
          ...getValues(), // Preserve the values for other fields
          occupation: undefined, // Reset 'occupation'
        },
        {
          keepErrors: false,
          keepDirty: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
          keepSubmitCount: false,
        }
      );
    }
  }, [watchExposedToChemicals, reset, getValues]);

  return (
    <div className="container mx-auto p-5">
      <Logo />

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="bg-black text-white text-xl font-bold py-2 px-6 mb-4">
          MEDICAL HISTORY
        </div>
        {/* Age */}
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            1. Please enter your age:
          </label>
          <input
            id="age"
            {...register("age", { required: true })}
            type="number"
            className="shadow appearance-none border rounded w-2/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage errors={errors} name="age" />
        </div>

        {/* Diet */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            2. Thinking about the foods you eat overall, how would you rank your
            diet in fat intake?
          </p>
          <div className="flex gap-x-2">
            {["Low", "Medium", "High"].map((option, index) => (
              <label
                key={index}
                className="inline-flex items-center custom-control"
              >
                <input
                  type="radio"
                  {...register("diet", { required: true })}
                  value={option}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
          <ErrorMessage errors={errors} name="diet" />
        </div>

        {/* Smoking Status */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            3. Do you currently smoke or have you previously been a smoker?
          </p>
          <div className="flex gap-x-2">
            {/* Updated class names to match the new styling */}
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("smokeStatus", { required: true })}
                value="Yes"
                className="hidden"
              />
              <span className="control-indicator"></span>{" "}
              {/* Correct class name */}
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("smokeStatus", {
                  required: "This question is required",
                })}
                value="No"
                className="hidden"
              />
              <span className="control-indicator"></span>{" "}
              {/* Correct class name */}
              <span className="ml-2">No</span>
            </label>
          </div>
          <ErrorMessage errors={errors} name="smokeStatus" />
          {watchSmokeStatus === "Yes" && (
            <>
              <p className="text-sm font-medium my-2">
                Please provide additional information:
              </p>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="flex gap-x-2 -mb-4">
                  {[
                    "I quit less than 10 years ago",
                    "I quit more than 10 years ago",
                    "I quit more than 20 years ago",
                    "I am a current smoker",
                  ].map((option, index) => (
                    <label
                      key={index}
                      className="inline-flex items-center custom-control"
                    >
                      <input
                        type="radio"
                        {...register("quitSmokingStatus", {
                          required: watchSmokeStatus === "Yes",
                        })}
                        value={option}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>{" "}
                      {/* Correct class name */}
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage errors={errors} name="quitSmokingStatus" />
                <div className="mt-4 -mb-4">
                  <label
                    htmlFor="packsPerDay"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    How many packs per day?
                  </label>
                  <input
                    id="packsPerDay"
                    {...register("packsPerDay", {
                      required: watchSmokeStatus === "Yes",
                    })}
                    type="number"
                    step="0.25"
                    className="border rounded w-full py-2 px-3 mt-1"
                  />
                </div>
                <ErrorMessage errors={errors} name="packsPerDay" />
                <div className="mt-4 -mb-4">
                  <label
                    htmlFor="yearsSmoked"
                    className="block text-sm font-medium text-gray-700"
                  >
                    How many years have you smoked?
                  </label>
                  <input
                    id="yearsSmoked"
                    {...register("yearsSmoked", {
                      required: watchSmokeStatus === "Yes",
                    })}
                    type="number"
                    className="border rounded w-full py-2 px-3 mt-1"
                  />
                </div>
                <ErrorMessage errors={errors} name="yearsSmoked" />
              </div>
            </>
          )}
        </div>
        {/* Hazardous Chemicals Exposure */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            4. Have you ever been exposed to hazardous chemicals known to cause
            cancer in your occupation?
          </label>
          <div className="flex gap-x-2 mt-2">
            {/* Updated class names to match the new styling */}
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("exposedToChemicals", { required: true })}
                value="Yes"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("exposedToChemicals", { required: true })}
                value="No"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">No</span>
            </label>
          </div>
          <ErrorMessage errors={errors} name="exposedToChemicals" />
          {watchExposedToChemicals === "Yes" && (
            <>
              <div>
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  What was the occupation?
                </label>
                <input
                  id="occupation"
                  {...register("occupation", {
                    required: watchExposedToChemicals === "Yes",
                  })}
                  type="text"
                  className="border rounded w-full py-2 px-3 mt-1"
                />
              </div>
              <ErrorMessage errors={errors} name="occupation" />
            </>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="mt-4 mb-4">
          <p className="text-sm font-medium mb-2">
            5. Have you ever had any of the following conditions?
          </p>
          <div className="-mx-2">
            {/* Row 1 */}
            <div className="flex flex-wrap mb-4">
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.highCholesterol")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">High Cholesterol</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.highBloodPressure")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">High Blood Pressure</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.prostateInfection")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Prostate Infection</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.enlargedProstate")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Enlarged Prostate</span>
              </label>
              {/* ... other labels for the first row */}
              {/* Repeat for each condition in the first row */}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap mb-4">
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.prostateSurgery")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Prostate Surgery</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.erectileDysfunction")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">
                  Erectile Dysfunction or Sexual Problems
                </span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.heartAttackOrStroke")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Heart Attack or Stroke</span>
              </label>
              {/* Repeat for each condition in the second row */}
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap mb-4">
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.heartDisease")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Heart Disease</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.typeOneDiabetes")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Type I (Childhood) Diabetes</span>
              </label>
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.typeTwoDiabetes")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Type II (Adult) Diabetes</span>
              </label>
              {/* Repeat for each condition in the third row */}
            </div>

            {/* Row 4 */}
            <div className="flex flex-wrap mb-4">
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.depression")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Depression</span>
              </label>
              {/* Prostate Cancer Checkbox with Conditional Input */}
              <label className="inline-flex items-center custom-control px-2">
                <input
                  type="checkbox"
                  {...register("conditions.prostateCancer")}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Prostate Cancer</span>
              </label>
              {watchProstateCancer && (
                <input
                  type="text"
                  {...register("prostateCancerTreatmentYear")}
                  placeholder="Year of treatment"
                  className="border rounded px-3 py-1" // Style as needed
                />
              )}
            </div>
          </div>
        </div>

        {/* PSA Tests */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            6. How many PSA blood tests have you had in the past 3 years?
          </p>
          <div className="flex gap-x-2">
            {["None", "1-3", "4-6", "7+"].map((option, index) => (
              <label
                key={index}
                className="inline-flex items-center custom-control"
              >
                <input
                  type="radio"
                  {...register("psaTestsCount", { required: true })}
                  value={option}
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
          <ErrorMessage errors={errors} name="psaTestsCount" />
        </div>

        {/* Question 7 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            7. Have you previously had an ABNORMAL rectal exam or PSA blood test?
          </label>
          <div className="flex gap-x-2">
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("hadAbnormalExam", { required: true })}
                value="Yes"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center custom-control">
              <input
                type="radio"
                {...register("hadAbnormalExam", { required: true })}
                value="No"
                className="hidden"
              />
              <span className="control-indicator"></span>
              <span className="ml-2">No</span>
            </label>
          </div>
          <ErrorMessage errors={errors} name="hadAbnormalExam" />
        </div>

        {watchHadAbnormalExam == "Yes" && (
          <>
            {/* Question 8 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                8. Did you receive a prostate biopsy as a part of your follow-up?
              </label>
              <div className="flex flex-col">
                <label className="inline-flex items-center custom-control mb-2">
                  <input
                    type="radio"
                    {...register("prostateBiopsy", {
                      required: "This question is required",
                    })}
                    value="I did not receive a prostate biopsy"
                    className="hidden"
                  />
                  <span className="control-indicator"></span>
                  <span className="ml-2">I did not receive a prostate biopsy</span>
                </label>
                <label className="inline-flex items-center custom-control mb-2">
                  <input
                    type="radio"
                    {...register("prostateBiopsy", {
                      required: "This question is required",
                    })}
                    value="The biopsy was negative/no cancer"
                    className="hidden"
                  />
                  <span className="control-indicator"></span>
                  <span className="ml-2">The biopsy was negative/no cancer</span>
                </label>
                <label className="inline-flex items-center custom-control">
                  <input
                    type="radio"
                    {...register("prostateBiopsy", {
                      required: "This question is required",
                    })}
                    value="The biopsy was positive/I was diagnosed with cancer"
                    className="hidden"
                  />
                  <span className="control-indicator"></span>
                  <span className="ml-2">
                    The biopsy was positive/I was diagnosed with cancer
                  </span>
                </label>
              </div>
              <ErrorMessage errors={errors} name="prostateBiopsy" />
            </div>
            {/* Question 9 */}
            {watchProstateBiopsy == "I did not receive a prostate biopsy" && (
              <div className="mt-4 mb-4">
                <p className="text-sm font-medium mb-2">
                  9. If you did NOT receive a prostate biopsy during follow-up, why
                  not?
                </p>
                <div className="-mx-2">
                  {/* Row 1 */}
                  <div className="flex flex-wrap mb-2">
                    {/* Map out the checkboxes for row 1 */}
                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.didntKnow")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">Didn’t know I was supposed to</span>
                    </label>

                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.notImportant")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">Didn't think it was important</span>
                    </label>

                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.afraid")}
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
                        {...register("noBiopsyReason.decidedNotTo")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">Dr. decided not to</span>
                    </label>

                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.couldNotAfford")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">Could not afford to</span>
                    </label>

                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.cameBackForTest")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">
                        I came back to PCAW for repeat test
                      </span>
                    </label>
                  </div>
                  {/* Row 3 */}
                  <div className="flex flex-wrap mb-4">
                    {/* Map out the checkbox for row 3 */}
                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.diagnosedBPH")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">
                        I was diagnosed with BPH or Enlarged Prostate (EP) at
                        follow-up
                      </span>
                    </label>
                    <label className="inline-flex items-center custom-control px-2">
                      <input
                        type="checkbox"
                        {...register("noBiopsyReason.normalPSA")}
                        className="hidden"
                      />
                      <span className="control-indicator"></span>
                      <span className="ml-2">Repeat PSA blood was normal</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        
        {/* Family History */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            10. Do you have a close biological relative that has been diagnosed
            with any of the following diseases:
          </p>

          <table>
            <thead>
              <tr>
                <th scope="col" className="font-medium pr-2">Disease</th>
                <th scope="col" className="font-medium pr-2">Father</th>
                <th scope="col" className="font-medium pr-2">Mother</th>
                <th scope="col" className="font-medium pr-2">Brother(s)</th>
                <th scope="col" className="font-medium pr-2">Sister(s)</th>
                <th scope="col" className="font-medium pr-2">Aunt(s)</th>
                <th scope="col" className="font-medium pr-2">Uncle(s)</th>
                <th scope="col" className="font-medium pr-2">Grandfather(s)</th>
                <th scope="col" className="font-medium pr-2">Grandmother(s)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(diseases).map(([diseaseKey, diseaseValue], index) => (
                <tr key={index}>
                  <th scope="row" className="font-medium">{diseaseValue}</th>
                  {Object.keys(relatives).map((relativeKey, relativeIndex) => {
                    const isParent =
                      relativeKey === "father" || relativeKey === "mother";
                    const baseName = `familyHistory.${diseaseKey}.${relativeKey}`;

                    return (
                      <td
                        key={relativeKey}
                      >
                        {!isParent ? (
                          <div className="space-x-2">
                            {/* Apply horizontal space between checkboxes */}
                            {[...Array(2)].map((_, checkboxIndex) => {
                              const name = `${baseName}${checkboxIndex + 1}`;
                              return (
                                <label
                                  key={checkboxIndex}
                                  className="justify-center items-center custom-control"
                                >
                                  <input
                                    type="checkbox"
                                    {...register(name as keyof FormData)}
                                    className="opacity-0 z-10"
                                    style={{ width: "16px", height: "16px" }} // Adjust this if necessary
                                    id={`${baseName}-${checkboxIndex}-${index}-${relativeIndex}`}
                                  />
                                  <span className="control-indicator"></span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <label className="justify-center items-center custom-control">
                            <input
                              type="checkbox"
                              {...register(baseName as keyof FormData)}
                              className="opacity-0 z-10"
                              style={{ width: "16px", height: "16px" }} // Adjust this if necessary
                              id={`${baseName}-0-${index}`}
                            />
                            <span className="control-indicator"></span>
                          </label>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Race/Ethnicity */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            11. What race/ethnicity best describes you?
          </p>
          <div className="flex gap-x-2">
            {[
              "White",
              "Hispanic",
              "Black",
              "Asian",
              "Native American",
              "Hawaiian or Pacific Islander",
              "Other",
            ].map((option) => (
              <label
                key={option}
                className="inline-flex items-center custom-control"
              >
                <input
                  type="radio"
                  {...register("raceEthnicity", { required: true })}
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

          {/* Section 2 */}
        </div>
        <div className="mb-4">
          <div className="bg-black text-white text-xl font-bold py-2 px-6 mb-4 w-full">
            PARTICIPANT INFORMATION
          </div>
          {/* Name */}
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-5.5/12 px-3 mb-4 md:mb-0">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                id="lastName"
                {...register("lastName", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="lastName" />
            </div>
            <div className="w-full md:w-5.5/12 px-3 mb-4 md:mb-0">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <input
                id="firstName"
                {...register("firstName", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                //   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="firstName" />
            </div>
            <div className="w-full md:w-1/12 px-3">
              <label
                htmlFor="middleInitial"
                className="block text-sm font-medium text-gray-700"
              >
                MI:
              </label>
              <input
                id="middleInitial"
                {...register("middleInitial", { maxLength: 1 })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.slice(0, 1).toUpperCase(); // Restrict to one uppercase letter
                }}
              />
            </div>
          </div>
          {/* Address 1/2*/}
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-11/12 px-3 mb-4 md:mb-0">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                {...register("address", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="address" />
            </div>
            <div className="w-full md:w-1/12 px-3">
              <label
                htmlFor="aptNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Apt. #:
              </label>
              <input
                id="aptNumber"
                {...register("aptNumber")}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          {/* Address 2/2*/}
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City:
              </label>
              <input
                id="city"
                {...register("city", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="city" />
            </div>
            <div className="w-full md:w-4/12 px-3">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State:
              </label>
              <input
                id="state"
                {...register("state", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="state" />
            </div>
            <div className="w-full md:w-2/12 px-3">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code:
              </label>
              <input
                id="zipCode"
                {...register("zipCode", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="zipCode" />
            </div>
          </div>
          {/* Phone Number, DOB*/}

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number:
              </label>
              <input
                id="phoneNumber"
                {...register("phoneNumber", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="phoneNumber" />
            </div>
            {/* Date of Birth */}
            <div className="w-full md:w-1/2 px-3">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of birth:
              </label>
              <input
                id="dob"
                {...register("dob", { required: true })}
                type="date" // Change this to 'text' if you want to manually input the date
                // placeholder="DD/MM/YYYY"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-gray-600 text-xs italic mt-1 ml-2">
                Month, Day, Year
              </p>
              <ErrorMessage errors={errors} name="dob" />
            </div>
          </div>
          {/* Address 1/2*/}
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-full px-3 mb-4 md:mb-0">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address:
              </label>
              <input
                id="email"
                {...register("email", { required: true })}
                type="text"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="email" />
            </div>
          </div>
          {/* Waist size, Weight, and Height */}
          <div className="flex flex-wrap -mx-3 mb-4">
            {/* Waist Size */}
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <label
                htmlFor="waistSize"
                className="block text-sm font-medium text-gray-700"
              >
                Waist size:
              </label>
              <input
                id="waistSize"
                {...register("waistSize", { required: true, min: 0 })}
                type="number"
                placeholder="inches"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="waistSize" />
            </div>

            {/* Weight */}
            <div className="w-full md:w-1/3 px-3 mb-4 md:mb-0">
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight:
              </label>
              <input
                id="weight"
                {...register("weight", { required: true, min: 0 })}
                type="number"
                placeholder="pounds"
                className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage errors={errors} name="weight" />
            </div>

            {/* Height */}
            <div className="w-full md:flex-1 px-3 mb-4 md:mb-0">
              <label
                htmlFor="heightFeet"
                className="block text-sm font-medium text-gray-700"
              >
                Height:
              </label>
              <div className="flex">
                {/* Height Feet */}
                <div className="mr-2 flex-1">
                  <input
                    id="heightFeet"
                    {...register("heightFeet", {
                      required: "This question is required",
                      min: 0,
                    })}
                    type="number"
                    placeholder="feet"
                    className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage errors={errors} name="heightFeet" />
                </div>
                {/* Height Inches */}
                <div className="flex-1">
                  <input
                    id="heightInches"
                    {...register("heightInches", {
                      required: "This question is required",
                      min: 0,
                      max: 11,
                    })}
                    type="number"
                    placeholder="inches"
                    className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <ErrorMessage errors={errors} name="heightInches" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Time of Blood Draw */}
        <div className="flex flex-wrap -mx-3 mb-6 items-center justify-between">
          {/* Time of Blood Draw */}
          <div className="flex flex-col w-full lg:w-1/2 px-3 mb-4">
            <div className="flex flex-row items-center">
              <label
                htmlFor="bloodDrawHour"
                className="block text-sm font-medium text-gray-700 mr-4"
              >
                Time of Blood Draw:
              </label>
              <div className="flex items-center">
                <input
                  id="bloodDrawHour"
                  {...register("bloodDrawHour", {
                    required: "Time of blood draw is required",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="HH"
                  className="border rounded py-2 px-3 text-center mx-2 w-20"
                />
                <span className="text-sm font-medium text-gray-700">:</span>
                <input
                  id="bloodDrawMinute"
                  {...register("bloodDrawMinute", {
                    required: "Time of blood draw is required",
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="MM"
                  className="border rounded py-2 px-3 text-center mx-2 w-20"
                />
                <label className="inline-flex items-center custom-control mr-4">
                  <input
                    type="radio"
                    {...register("bloodDrawAmPm")}
                    value="AM"
                    className="hidden"
                  />
                  <span className="control-indicator"></span>
                  <span className="ml-2">AM</span>
                </label>
                <label className="inline-flex items-center custom-control">
                  <input
                    type="radio"
                    {...register("bloodDrawAmPm")}
                    value="PM"
                    className="hidden"
                  />
                  <span className="control-indicator"></span>
                  <span className="ml-2">PM</span>
                </label>
              </div>
            </div>
            <ErrorMessage errors={errors} name="bloodDrawHour" />
          </div>

          {/* Fasting Status */}
          <div className="flex flex-col w-full lg:w-1/2 px-3 mb-4">
            <div className="flex flex-row items-center">
              <label className="block text-sm font-medium text-gray-700 mr-4">
                Are you currently fasting?
              </label>
              <label className="inline-flex items-center custom-control mr-4">
                <input
                  type="radio"
                  {...register("fastingStatus", { required: true })}
                  value="Yes"
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center custom-control">
                <input
                  type="radio"
                  {...register("fastingStatus", { required: true })}
                  value="No"
                  className="hidden"
                />
                <span className="control-indicator"></span>
                <span className="ml-2">No</span>
              </label>
            </div>
            <ErrorMessage errors={errors} name="fastingStatus" />
          </div>
        </div>

        <div className="bg-black text-white text-xl font-bold py-2 px-6 mb-4">
          PARTICIPANT INFORMED CONSENT AND WAIVER FOR SCREENING
        </div>

        <p className="font-bold mt-4">
          Welcome to Prostate Cancer Awareness Month (PCAM). In order to be screened at a PCAM site, every participant must read and
          sign this Informed Consent form. The Prostate Health Assessment Event will consist of a blood draw for Prostate Specific Antigen
          (PSA) blood test. Some specific locations may offer a Digital Rectal Exam (DRE) as well, if you agree to have one. Additionally,
          some specific locations may be testing other men’s health blood tests such as; Testosterone, Cholesterol, Triglycerides, HDL, LDL and
          Glucose levels.
        </p>

        <p className="mt-4">PROCEDURES</p>
        <p>
          Blood will be drawn by a healthcare professional for a PSA test (and if applicable, other men’s health tests listed above). You will be informed
          of your blood test results at a later date, via US mail, because the labs will require analysis at a laboratory. You should receive your test results
          within 2-6 weeks after this event. If applicable, the Digital Rectal Exam will be performed by a trained Healthcare Professional by inserting a
          gloved finger into the rectum and gently pressing against the prostate gland. The DRE results will be included in the same letter as the lab
          results. If your PSA and or DRE results are abnormal, we recommend that you contact your personal physician. Please share all results, normal
          or abnormal with a Physician. Your lab results will be reviewed by a Physician and will come from the Prostate Conditions Education Council.
        </p>
        <p className="mt-2">
        A portion of the blood sample drawn may be saved for the purpose of repeating either the same test or to measure other substances related
        to your health. If you decide now that a portion of your blood can be kept for future studies, but change your mind at a later date, simply
        contact PCEC at 303-316-4685 or toll-free at 866-477-6788 to let us know that you do not want your blood used. Future examination of your
        blood specimen may be done at other sites.
        </p>

        <p className="mt-4">RISKS</p>
        <p>
        Collection of the blood specimen may cause minor discomfort, or occasionally an infection may result and a swelling containing blood (a
hematoma) may develop.
        </p>

        <p className="mt-4">PARTICIPATION</p>
        <p>
        Participation is voluntary. By receiving a screening, you recognize, understand and accept all risks and responsibilities associated with and
resulting from it. This program will only screen for abnormalities in the prostate using a PSA test and does not constitute a complete medical
examination or diagnosis. Test results do not represent or imply that you DO or DO NOT have prostate cancer. Although a PSA cannot
definitively diagnose prostate cancer, they may indicate levels of probability of having, or not having prostate cancer. For diagnosis of a
medical condition such as prostate cancer, you acknowledge, understand and accept that you must see a physician for a complete medical
examination.
        </p>

        <p className="mt-4">CONFIDENTIALITY</p>
        <p>
        As part of this study, you allow the release of all information from your medical records with regard to prostate disease and treatment to the
PCEC and its agents. You allow the PCAM screening site and the PCEC and its agents to contact you regarding prostate cancer screening
and your participation in this program. You also authorize the PCEC to use this information, including the results of your screening tests for
statistical evaluation, scientific research and publication. You will not be individually identified in any recognizable way. The results of these
screening tests will be released to you and, aside from the names above, the confidentiality of all of your medical records will be maintained
within legal limits. Please note that while your anonymity will be guaranteed by signing this consent you do realize that your responses on this
questionnaire as well as your blood sample could be used for future analysis, and in/for future studies. The PCEC and its affiliates may contact
you based on your tests results and responses.
        </p>

        <p className="mt-4">SUBJECT AGREEMENT WAIVER</p>
        <p>
        I have read, understand and accept this informed consent and waiver. I have had the opportunity to ask questions, have been informed as
to the purpose of the Screening and the potential risks and I freely consent to be a participant in the Screening. I understand and assume all
risks associated with my participation in this program and the Screening. I understand that the program will only screen for abnormalities in
the prostate area and does not constitute a complete medical exam or diagnosis. I understand that abnormal test results do not represent or
imply that I DO have prostate cancer. For a diagnosis of a medical problem, I acknowledge that I must see a physician for a complete medical
examination. I understand that I am responsible for my own health. The responsibility for any follow-up examinations to check abnormalities
found during this screening lies solely with me and not with any participating organization, physician, or other health care volunteer. I
understand that I will receive a copy of this informed consent and release upon request. I understand and agree to the use of information from
my medical records in accordance with the limitations set forth in this consent form. Having read this informed consent and waiver, and in
consideration of PCEC accepting me for participation in this prostate cancer screening program, I, for myself and for anyone entitled to act on
my behalf, waive and release PCEC and its agents and sponsors from all claims of any kind arising out of my participation in the program and
Screening.
        </p>

        <p className="font-bold mt-4">PLEASE NOTE:</p>
        <p className="font-bold">
        A screening is NOT a diagnosis; it is important to evaluate the risks and benefits of diagnosis and screening. Please be sure to contact
a physician if you have any questions.
        </p>


        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="w-full md:w-5.5/12 px-3 mb-4 md:mb-0">
            <label
              htmlFor="signature"
              className="block text-sm font-medium text-gray-700"
            >
              Signature of Participant:
            </label>
            <input
              id="signature"
              {...register("signature", { required: true })}
              type="text"
              className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage errors={errors} name="signature" />
          </div>
          <div className="w-full md:w-5.5/12 px-3 mb-4 md:mb-0">
            <label
              htmlFor="signatureDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              id="signatureDate"
              {...register("signatureDate", { required: true })}
              type="date"
              className="border rounded w-full py-2 px-3 mt-1 shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <ErrorMessage errors={errors} name="signatureDate" />
          </div>
        </div>

        {!isValid && <p className="error-message text-red-500 text-xs">Required field missing</p>}

        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {!mutation.isPending ? 'Submit' : 'Loading...'}
        </button>

        {mutation.isPending && <h1 className='mt-6 text-xl text-medium'>Submitting form and generating code, please wait...</h1>}
      </form>
    </div>
  );
};
export default Form;
