import { GetServerSideProps } from 'next'
import { AuthNService } from 'pangea-node-sdk'

import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { Category, Comment, FundInvestment, Fundraiser, User } from '@prisma/client'

import Description from '@/components/detail/Description'
import Header from '@/components/detail/Header'
import Analystics from '@/components/layouts/analytics'

export default function Detail({
  fundraiser,
}: Readonly<{
  fundraiser: Fundraiser & {
    investments: (FundInvestment & { User: { first_name: string; last_name: string } })[]
    category: Category
    organizer: User
    comments: Comment[]
  }
}>) {
  return (
    <Analystics activeLink="Fundraisers" title={fundraiser?.title ?? ''}>
      <main className="pb-10">
        <Header fundraiser={fundraiser} />
        <Description fundraiser={fundraiser} />
      </main>
    </Analystics>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { uid } = query as any

  const auth = new AuthNService(AUTHN_TOKEN, pangea)

  const fundraiser = await prisma.fundraiser.findFirst({
    where: { id: uid as string },
    include: {
      category: true,
      organizer: true,
      investments: {
        include: {
          User: true,
        },
      },
      comments: {
        include: {
          sponsor: {
            select: { email: true },
          },
        },
      },
    },
  })
  const organizer = await auth.user.profile.getProfile({
    email: fundraiser?.organizer?.email as string,
  })

  const profile = organizer.result.profile
  fundraiser!.organizer = { ...fundraiser!.organizer, ...profile }

  if (fundraiser?.comments.length) {
    const comments = []
    for (let comment of fundraiser.comments) {
      const newComment = comment

      const sponsor = await auth.user.profile.getProfile({
        email: comment?.sponsor?.email,
      })
      const profile = sponsor.result.profile
      newComment.sponsor = { ...newComment.sponsor, ...profile }
      comments.push(newComment)
    }

    fundraiser.comments = comments
  }

  if (fundraiser?.investments.length) {
    const investments = []
    for (let investment of fundraiser.investments) {
      const newComment = investment

      const sponsor = await auth.user.profile.getProfile({
        email: investment?.User?.email as string,
      })
      const profile = sponsor.result.profile
      newComment.User = { ...newComment.User, ...(profile as any) }
      investments.push(newComment)
    }

    fundraiser.investments = investments
  }

  return {
    props: { fundraiser: JSON.parse(JSON.stringify(fundraiser)) },
  }
}
