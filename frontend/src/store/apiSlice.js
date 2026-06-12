import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizApiSlice = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Quizzes', 'Results', 'Questions', 'Reattempts'],
  endpoints: (builder) => ({
    getAvailableQuizzes: builder.query({
      query: () => '/quiz/available',
      providesTags: ['Quizzes']
    }),
    getQuizQuestions: builder.query({
      query: (quizId) => `/quiz/${quizId}/questions`,
      providesTags: ['Questions']
    }),
    submitQuiz: builder.mutation({
      query: (quizData) => ({
        url: '/quiz/submit',
        method: 'POST',
        body: quizData
      }),
      invalidatesTags: ['Results']
    }),
    getResults: builder.query({
      query: () => '/quiz/results',
      providesTags: ['Results']
    }),
    getAdminQuizzes: builder.query({
      query: () => '/admin/quizzes',
      providesTags: ['Quizzes']
    }),
    getAdminResults: builder.query({
      query: () => '/admin/results',
      providesTags: ['Results']
    }),
    getMyAttempts: builder.query({
      query: () => '/quiz/my-attempts',
      providesTags: ['Results']
    }),
    getMyReattempts: builder.query({
      query: () => '/quiz/my-reattempts',
      providesTags: ['Reattempts']
    }),
    requestReattempt: builder.mutation({
      query: (data) => ({
        url: '/quiz/request-reattempt',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Reattempts']
    }),
    getAdminReattempts: builder.query({
      query: () => '/admin/reattempts',
      providesTags: ['Reattempts']
    }),
    updateReattemptStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/reattempts/${id}/status`,
        method: 'PUT',
        body: { status }
      }),
      invalidatesTags: ['Reattempts', 'Results']
    }),
    updateResultScore: builder.mutation({
      query: ({ resultId, ...data }) => ({
        url: `/admin/results/${resultId}/grade`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Results']
    }),
    createQuiz: builder.mutation({
      query: (quizData) => ({
        url: '/admin/quizzes',
        method: 'POST',
        body: quizData
      }),
      invalidatesTags: ['Quizzes']
    }),
    getAdminQuestions: builder.query({
      query: (quizId) => `/admin/questions/${quizId}`,
      providesTags: ['Questions']
    }),
    createQuestion: builder.mutation({
      query: (questionData) => ({
        url: '/admin/questions',
        method: 'POST',
        body: questionData
      }),
      invalidatesTags: ['Questions', 'Quizzes']
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Quizzes']
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: '/users/login',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Quizzes']
    })
  })
});

export const {
  useGetAvailableQuizzesQuery,
  useGetQuizQuestionsQuery,
  useSubmitQuizMutation,
  useGetResultsQuery,
  useGetAdminQuizzesQuery,
  useGetAdminResultsQuery,
  useGetMyAttemptsQuery,
  useCreateQuizMutation,
  useGetAdminQuestionsQuery,
  useCreateQuestionMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateResultScoreMutation,
  useGetMyReattemptsQuery,
  useRequestReattemptMutation,
  useGetAdminReattemptsQuery,
  useUpdateReattemptStatusMutation
} = quizApiSlice;
