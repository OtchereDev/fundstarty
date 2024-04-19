import Description from '@/components/detail/Description'
import Header from '@/components/detail/Header'
import Dashboard from '@/components/layouts/dashboard'
import pangea, { AUTHN_TOKEN } from '@/constants/pangea'
import { prisma } from '@/lib/prismaClient'
import { Fundraiser } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { AuthNService } from 'pangea-node-sdk'

export default function Detail({ fundraiser }: { fundraiser: Fundraiser }) {
  return (
    <Dashboard title={fundraiser?.title ?? ''}>
      <main className="pb-10">
        <Header />
        <Description />
      </main>
    </Dashboard>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { uuid } = params as any

  const auth = new AuthNService(AUTHN_TOKEN, pangea)

  const fundraiser = await prisma.fundraiser.findFirst({
    where: { id: uuid as string },
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

  return {
    props: { fundraiser: JSON.parse(JSON.stringify(fundraiser)) },
  }
}
