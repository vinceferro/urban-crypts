import { Button } from 'flowbite-react';
import { Dropzone } from './Dropzone';

export const CreateRecord = ({
  files,
  handleFileChange,
  handleRemoveImage,
  submitDisabled,
}: {
  files: File[] | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  submitDisabled: boolean;
}) => {
  return (
    <>
      <Dropzone onChange={handleFileChange} name='files' />

      <div className='mt-8 flex flex-wrap justify-center gap-4'>
        {files &&
          Array.from(files).map((file, index) => (
            <div key={file.name} className='relative'>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className='h-48 w-48 object-cover'
              />
              <button
                type='button'
                className='absolute right-2 top-2 rounded-full bg-red-500 p-0.5 shadow'
                onClick={() => handleRemoveImage(index)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          ))}
      </div>
      <Button
        type='submit'
        disabled={submitDisabled}
        aria-disabled={submitDisabled}
      >
        Submit Record
      </Button>
    </>
  );
};
