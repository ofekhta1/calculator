import { Heading } from '@chakra-ui/react'

const SiteHeading = () => {
    const heading ='Calculator';
  return (
    <Heading as='h1' marginY={5} fontSize={'5xl'}>{heading}</Heading>
  )
}

export default SiteHeading