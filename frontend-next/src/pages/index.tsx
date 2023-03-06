import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import useTranscripts from '@/hooks/useTranscripts'
import QueueTable from '@/components/queueTable/QueueTable'

export default function Home() {
  const { data, isLoading } = useTranscripts().transcripts
  return (
    <>
      <QueueTable data={data} isLoading={isLoading} />
    </>
  )
}
