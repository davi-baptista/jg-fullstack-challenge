export interface Comment {
  id: string
  content: string
  createdAt: string
  authorId: string
  name: string
  email: string
}

export interface ListCommentsResponse {
  total: number
  comments: Comment[]
}