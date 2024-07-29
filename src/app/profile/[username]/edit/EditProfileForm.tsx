'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { CldImage } from 'next-cloudinary';

const animalEmojis = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🦁',
  '🐮',
  '🐷',
  '🐸',
  '🐙',
];

console.log(
  'Cloudinary Cloud Name:',
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
);

export default function EditProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    ...user,
    userImage:
      user.userImage ||
      animalEmojis[Math.floor(Math.random() * animalEmojis.length)],
  });
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const router = useRouter();

  useEffect(() => {
    setFormData(user);
    setInterests(user.interests ? user.interests.split(',') : []);
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          interests: JSON.stringify(interests),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setFormData(updatedUser.user);
        router.push(
          `/profile/${updatedUser.user.username}/${updatedUser.user.slug}`,
        );
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/register');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (catchError: any) {
      setError(catchError.message);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleEmojiClick() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiSelect(emoji: string) {
    setFormData((prevData: any) => ({
      ...prevData,
      userImage: emoji,
    }));
    setShowEmojiPicker(false);
  }

  async function handleAddInterest() {
    const titleCaseInterest = toTitleCase(newInterest);

    if (
      newInterest &&
      interests.length < 7 &&
      !interests.includes(titleCaseInterest)
    ) {
      try {
        const response = await fetch('/api/interests', {
          method: 'POST',
          body: JSON.stringify({ categoryName: titleCaseInterest }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setInterests([...interests, titleCaseInterest]);
          setNewInterest('');
        } else {
          throw new Error('Failed to add interest');
        }
      } catch (error) {
        setError('Failed to add interest');
      }
    } else if (interests.includes(titleCaseInterest)) {
      setError('Interest already added');
    }
  }

  async function handleRemoveInterest(interestToRemove: string) {
    try {
      const response = await fetch('/api/interests', {
        method: 'DELETE',
        body: JSON.stringify({
          categoryName: interestToRemove,
          userId: user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove interest');
      }

      setInterests(
        interests.filter((interest) => interest !== interestToRemove),
      );
    } catch {
      setError('Failed to remove interest');
    }
  }

  function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  }

  function handleUpload(result: any) {
    if (result.event === 'success') {
      setFormData((prevData: any) => ({
        ...prevData,
        userImage: result.info.secure_url,
      }));
    }
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          Edit My Profile
        </h1>
        <div className="text-center">
          <button
            className="text-9xl cursor-pointer"
            onClick={handleEmojiClick}
            tabIndex={0}
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              width: '150px',
              height: '150px',
            }}
          >
            {formData.userImage.startsWith('http') ? (
              <CldImage
                src={formData.userImage}
                width="150"
                height="150"
                crop="fill"
                alt=""
              />
            ) : (
              formData.userImage
            )}
          </button>
          {showEmojiPicker && (
            <div className="mt-2 flex flex-wrap justify-center space-x-2">
              {animalEmojis.map((emoji) => (
                <button
                  key={`emoji-${emoji}`}
                  className="text-2xl cursor-pointer"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 flex space-x-4 justify-center">
            <button
              onClick={handleEmojiClick}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              Change Avatar
            </button>
            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={handleUpload}
              options={{
                styles: {
                  palette: {
                    window: '#FFFFFF',
                    sourceBg: '#F4F4F5',
                    windowBorder: '#90A0B3',
                    tabIcon: '#0369a1',
                    inactiveTabIcon: '#0284c7',
                    menuIcons: '#0284c7',
                    link: '#0284c7',
                    action: '#059669',
                    inProgress: '#047857',
                    complete: '#059669',
                    error: '#E92626',
                    textDark: '#1f2937',
                    textLight: '#FFFFFF',
                  },
                  fonts: {
                    default: null,
                    "'Open Sans', sans-serif": {
                      url: 'https://fonts.googleapis.com/css?family=Open+Sans',
                      active: true,
                    },
                  },
                  frame: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    width: '400px',
                    height: '400px',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    zIndex: '1000',
                  },
                },
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Upload Image
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
        {!!error && <p className="text-red-500 text-center">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-6 bg-gray-100 dark:bg-gray-700 p-6 rounded-md mx-auto"
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={formData.fullName ? '' : 'Enter your full name'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={
                formData.description ? '' : 'Enter a description of yourself'
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="newInterest"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Interests
            </label>
            <div className="flex space-x-2 items-center">
              <input
                id="newInterest"
                name="newInterest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a new interest"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                style={{ height: 'calc(2rem + 2px)' }}
              >
                Add
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {interests.map((interest) => (
                <span
                  key={`interest-${interest}`}
                  className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="profileLinks"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Personal Links
            </label>
            <input
              id="profileLinks"
              name="profileLinks"
              value={formData.profileLinks}
              onChange={handleChange}
              placeholder={
                formData.profileLinks ? '' : 'Enter your personal links'
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Birth Date
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              placeholder={formData.birthdate ? '' : 'Enter your birth date'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="profession"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Profession
            </label>
            <input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              placeholder={formData.profession ? '' : 'Enter your profession'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
