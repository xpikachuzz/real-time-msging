import { useContext } from 'react'
import { Field, Formik } from 'formik';
import socket from '../../socket';
import * as Yup  from 'yup';
import { MessagesContext } from '../../context/MessagesContext';

export const ChatBox = ({ userId }) => {
  const { setMessages } = useContext(MessagesContext);

  return (
    <Formik
      // what to run when submitting
      onSubmit={(values, action) => {
        const message = {to: userId, from: null,  content: values.message}
        socket.emit("dm", message)
        setMessages(prevMsgs => [message, ...prevMsgs])
        action.resetForm();
      }}
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
      })}
    >
    {(formik) => (
      <form
        onSubmit={formik.handleSubmit}
        className='flex flex-row justify-between px-5'
      >
        <input 
          name='message'
          placeholder='Type your message..'
          className='bg-blue-200 w-full px-2 py-1'
          autoComplete='off'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.message}
        />
        <button
          type='submit'
          className='w-20 bg-blue-400 ml-2 py-1 hover:cursor-pointer hover:shadow-xl hover:rounded-sm'
        >
          Send
        </button>
      </form>
    )}
    </Formik>
  );
};

