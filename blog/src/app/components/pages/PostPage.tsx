"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  VStack,
  Text,
  Flex,
  Avatar,
  Tag,
  Image as ChakraImage,
  useColorModeValue,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { LuBookmark, LuBookmarkPlus, LuShare } from "react-icons/lu";
import { PostsCards } from "../PostsCards";
import { usePost } from "@/src/hooks";
import { PostSelect } from "@/src/types";
import { Skeleton } from "@/src/app/components/ui/Skeleton";
import Loader from "../Loader";

interface FeaturedImage {
  src: string;
  alt_text: string;
}

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  const postContentBg = useColorModeValue("white", "gray.900");
  const imageWrapBg = useColorModeValue("gray.100", "gray.700");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (post) {
      setIsLoading(false);
    }
  }, [post]);
  if (isLoading || !post) {
    return (
      <Stack h={"100vh"} align={"center"} justify={"center"}>
        <Loader />
      </Stack>
    );
  }
  return (
    <>
      {post && (
        <Flex
          alignItems={{ base: "normal", lg: "flex-start" }}
          py={8}
          pr={3}
          pos={"relative"}
          direction={{ base: "column", lg: "row" }}
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          gap={{ base: 5, lg: 6 }}
          maxW={1400}
          mx="auto"
        >
          <Container maxW="5xl" px={{ base: 3, sm: 4 }}>
            <Box minH={300} rounded={{ base: 20, md: 24 }}>
              <ChakraImage
                src={
                  post.featured_image!?.src ?? "https://picsum.photos/1200/600"
                }
                alt={post.featured_image!?.alt_text || ""}
                w="full"
                h="auto"
                maxH={600}
                minH={"300px"}
                objectFit={"cover"}
                rounded={{ base: 20, md: 24 }}
              />
            </Box>

            <Box
              mt={{ base: -20, md: -24 }}
              pos={"relative"}
              px={{ base: 2, sm: 3, md: 3, lg: 5 }}
              zIndex={2}
            >
              <Box
                bg={postContentBg}
                rounded={{ base: 20, md: 24 }}
                p={{ base: 2, sm: 3, md: 4, lg: 6 }}
              >
                <Flex gap={{ base: 4, md: 6 }}>
                  <VStack
                    shadow={{ base: "lg", md: "none" }}
                    gap={{ base: 8, md: 12 }}
                    pos={{ base: "fixed", md: "relative" }}
                    top={"50%"}
                    transform={{ base: "translateY(-50%)", md: "none" }}
                    left={0}
                    h={{ base: "auto", md: "100%" }}
                    bg={postContentBg}
                    roundedRight={{ base: 20, md: 0 }}
                    p={{ base: 3, md: 0 }}
                  >
                    <VStack mt={{ base: 4, md: 12 }} gap={4}>
                      <IconButton
                        icon={<LuBookmark />}
                        variant={"outline"}
                        rounded={"full"}
                        aria-label="bookmark this post"
                      />
                      <IconButton
                        icon={<LuShare />}
                        variant={"outline"}
                        rounded={"full"}
                        aria-label="share this post"
                      />
                    </VStack>
                    <Box
                      as={Flex}
                      flexDir={"column"}
                      alignItems={"center"}
                      fontSize={{ base: "small", md: "medium", lg: "large" }}
                    >
                      <Text as="span" fontWeight={"bold"} fontSize={"100%"}>
                        {post?.views}
                      </Text>
                      <Text as="span" fontSize={"90%"}>
                        views
                      </Text>
                    </Box>
                  </VStack>
                  <Box as="article">
                    <HStack my={4} gap={{ base: 5, md: 8 }} ml={0}>
                      {post?.category && (
                        <Text as="span" color="gray.500" fontWeight="semibold">
                          {post?.category?.name}
                        </Text>
                      )}

                      <Text color="gray.500" as="span">
                        {format(
                          new Date(post.updated_at as Date),
                          "MMMM d, yyyy"
                        )}
                      </Text>
                    </HStack>
                    <Box as="header" mb={8}>
                      <Heading as="h1" size="2xl" mb={4}>
                        {post.title}
                      </Heading>
                      {/* <Flex flexWrap="wrap" gap={2} mb={4}>
            {post?.tags && post?.tags?.map((tag, index) => (
              <Tag key={index} bg={"gray.200"} color="gray.700" size="sm" >
                #{tag}
              </Tag>
            ))}
          </Flex> */}
                    </Box>

                    <Box className="prose" maxW="none">
                      <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        mb={4}
                        color="gray.600"
                      >
                        {post.summary}
                      </Text>
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: post.content as string,
                        }}
                      />
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Quidem dicta, dolorum alias fugiat rerum ut dolor eaque
                      exercitationem amet vitae totam ipsam neque voluptatum
                      cupiditate consequuntur atque nobis mollitia facere.
                      Nihil, esse. Similique ut, ipsum voluptatum deleniti saepe
                      dolor minus distinctio placeat sequi ex unde labore libero
                      laudantium beatae. Nisi molestiae nulla consequatur
                      aspernatur officiis aperiam maxime Lorem ipsum dolor sit
                      amet consectetur adipisicing elit. Harum odit unde animi
                      rem sed voluptate nesciunt explicabo reprehenderit
                      adipisci reiciendis, veritatis, illo deserunt veniam,
                      pariatur odio quisquam corrupti quia assumenda voluptatem
                      eaque. Autem fugiat vero inventore provident fuga pariatur
                      nostrum quo in nulla voluptatem temporibus ratione
                      quisquam, mollitia aliquam, voluptatibus tempore, cum
                      suscipit iure consectetur. Vero officiis, vitae quisquam
                      inventore distinctio fugit corporis magnam sunt nesciunt
                      aperiam asperiores, ut molestias qui perferendis molestiae
                      impedit quaerat nisi voluptate dolorum nobis ipsum omnis.
                      Aliquam, corrupti aut. Cupiditate assumenda esse
                      perspiciatis facere ea reprehenderit placeat magni
                      corrupti cumque impedit? Culpa maiores velit suscipit
                      totam, eius accusantium eos. Voluptatibus, aliquid! Aut
                      ipsam dolorum mollitia illum esse sapiente asperiores
                      harum deleniti reprehenderit nulla dolor ullam, repellat,
                      eveniet saepe porro quas omnis iste iusto facere ut
                      laboriosam enim fugiat est modi. Ullam autem eligendi
                      esse, animi voluptas labore praesentium numquam et facere,
                      dolore qui accusantium itaque magni laudantium eveniet
                      error necessitatibus sint ipsum? Numquam recusandae
                      temporibus amet aliquam maxime rem vero quae porro
                      corporis at fugiat harum labore tempore corrupti, est,
                      totam tempora! Cupiditate asperiores distinctio sint qui
                      in corrupti, hic eligendi voluptatibus doloremque quam
                      magni animi praesentium non voluptas quod blanditiis
                      expedita aut nobis itaque. Voluptatum, quam velit quis
                      pariatur iure cumque sed non porro, reprehenderit, aliquid
                      eaque excepturi modi quae saepe. Nam odio eveniet eius
                      laborum officia, obcaecati et. Provident, pariatur
                      consequuntur. Eaque itaque numquam recusandae soluta,
                      nobis molestias, cum architecto quo minus exercitationem
                      eius cumque possimus, perferendis impedit beatae error
                      adipisci illum dignissimos saepe. Sapiente saepe est autem
                      rerum sunt porro? Nisi ducimus a deserunt eveniet facere
                      illum, eum ipsum accusantium inventore consequatur ratione
                      sapiente optio possimus velit sit nihil maiores ad maxime?
                      Maxime velit unde ex obcaecati aspernatur voluptates ea
                      numquam beatae, eius dolor. Consectetur maxime officia
                      distinctio soluta aperiam odio voluptatum in hic labore
                      minima totam pariatur nihil molestiae adipisci excepturi,
                      architecto ab incidunt non! Doloremque eum quos
                      asperiores! Voluptas veniam totam harum itaque? Officia
                      deleniti non incidunt voluptatem, maxime nobis omnis quod
                      ducimus in placeat exercitationem ipsa eum vitae harum
                      esse corrupti nam? Cupiditate minus magni possimus nobis
                      officia commodi voluptatibus voluptatum rerum voluptatem
                      eum! Nisi sed facere provident aut recusandae eveniet
                      voluptates nesciunt doloremque. Excepturi voluptatibus
                      reprehenderit ex cupiditate perferendis atque aspernatur
                      laboriosam repellat minima vel, molestias odit cumque
                      quidem quia magnam modi accusantium, est praesentium nisi
                      dolorem porro. Dignissimos doloribus culpa laudantium rem
                      officia dicta, rerum totam iusto eaque temporibus?
                      Tempora, omnis ipsum, earum voluptate sint blanditiis
                      saepe amet porro ipsa minus commodi architecto repellat
                      dicta. Impedit officiis eos nesciunt blanditiis illum unde
                      recusandae repellendus maxime numquam natus sit esse
                      debitis, aliquid minima soluta, reiciendis adipisci iste
                      ullam quidem deserunt est eligendi ipsum! Eligendi, ab
                      earum reprehenderit ipsum rerum obcaecati quo modi?
                      Tempore culpa veritatis deleniti voluptatem dignissimos
                      sequi amet nobis a tempora corrupti quod assumenda
                      reprehenderit qui accusantium, molestiae aliquid eos?
                      Illum recusandae, unde expedita laboriosam esse nobis eos,
                      corrupti, quod quo voluptate explicabo odio. Expedita
                      molestias ab, vero temporibus aliquid neque, eveniet
                      similique blanditiis, beatae saepe iste! Labore
                      perspiciatis ad sapiente ea quam aliquid sed sit
                      aspernatur blanditiis odit deleniti quibusdam quae,
                      tempora molestiae eius rem porro et dignissimos inventore
                      vitae iure. Qui iure eius odio repellendus ab tempora
                      vitae sunt, officia fuga neque. Sed aliquid eos aspernatur
                      porro nostrum voluptatem dolor, sunt aliquam quam culpa
                      totam optio odio explicabo qui quo rem numquam! Ab sunt
                      ipsum voluptate vitae laborum! Sed, odio? Animi nihil
                      velit illo aliquam pariatur minima quam earum aut, officia
                      ipsa, nisi mollitia, soluta quos dicta veniam nobis sint
                      facilis consequuntur laborum quibusdam. Eos pariatur,
                      corporis ad dolor numquam iste voluptas alias laborum amet
                      eligendi nulla quia voluptate quam eum culpa natus fuga.
                      Neque quibusdam porro, repellendus quia quidem amet magni
                      cum commodi nam adipisci autem debitis, itaque omnis
                      nostrum esse ipsum aliquam natus fuga maiores dolor. Sit
                      praesentium quae animi vel? Neque, rerum! Inventore illum
                      quo impedit mollitia ex asperiores. Minus nam laborum modi
                      expedita commodi quis molestias nemo dolorem repudiandae
                      non sapiente, omnis deleniti id! Fugiat officia laboriosam
                      deserunt perspiciatis dolor, tenetur sint, quisquam
                      dolorem, sapiente tempore quaerat ut repellat iure
                      obcaecati eaque dolores asperiores nostrum provident
                      mollitia! Asperiores veritatis ut sunt adipisci, illo
                      suscipit omnis maxime quod magni sint odio distinctio
                      necessitatibus error. Dolore repellendus quam accusantium
                      nam nobis, quia eos temporibus iste adipisci animi
                      delectus qui minus blanditiis tenetur odit officia,
                      reiciendis laboriosam placeat ad voluptas quibusdam?
                      Eveniet ea molestiae molestias a fuga adipisci est odio
                      similique rem eos nihil repellendus obcaecati accusantium
                      nobis corporis labore aliquid praesentium unde, porro
                      earum quibusdam placeat dolore nisi? Minus id doloribus
                      iure aut doloremque neque maiores optio obcaecati qui
                      sapiente eos pariatur, aperiam libero eveniet veritatis
                      iste dolorem temporibus repudiandae deserunt nulla ipsum!
                      Amet quisquam debitis inventore sequi aut sapiente,
                      consectetur reprehenderit nemo maiores dicta atque
                      voluptatibus laboriosam ea eius qui doloribus neque
                      voluptas iure sunt laborum id voluptates! Fugit, a. Cum
                      voluptas veniam velit, dolorem facilis ullam doloribus
                      impedit alias perferendis ipsum, laboriosam at provident?
                      Consequatur illo, nulla facilis cum soluta neque voluptas
                      recusandae rem fugiat quasi est ad eius maxime blanditiis
                      corrupti et consequuntur quos? Aliquam ut esse quos
                      accusantium id velit ullam voluptas reprehenderit magni,
                      enim blanditiis eligendi! Voluptatem magnam cumque laborum
                      tenetur eos praesentium dolorem excepturi, natus labore
                      voluptatibus esse? Cum debitis aspernatur maxime corporis,
                      praesentium similique alias quos ut, delectus tempore,
                      repellat est. Minima adipisci totam non eligendi harum
                      sunt minus nesciunt maxime at, blanditiis provident
                      voluptatibus assumenda accusamus maiores explicabo libero
                      corporis aperiam. Et eaque exercitationem iure possimus.
                      Praesentium recusandae fugit aspernatur sit. Assumenda,
                      explicabo ratione vero doloribus repellat ipsa voluptate
                      itaque consequatur, aspernatur, iusto excepturi quo
                      accusamus placeat praesentium sed autem corporis. Dolorum
                      magni repellendus sequi vitae ipsum sit! Numquam, sunt?
                      Praesentium adipisci architecto aut itaque voluptas,
                      consequuntur magnam id nesciunt beatae blanditiis
                      explicabo expedita voluptatem necessitatibus ullam harum
                      illo hic ad, ex maxime iste rem. Perferendis culpa iste ut
                      dolores omnis fuga modi. Ullam unde aliquam earum
                      perspiciatis saepe sed deserunt dolore beatae rem.
                      Delectus, at voluptatem possimus minus corrupti est atque
                      harum omnis.
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Box
              mt={-10}
              pos={"relative"}
              px={{ base: 3, md: 4 }}
              pt={10}
              bg={imageWrapBg}
              rounded={{ base: 20, md: 24 }}
            >
              <Box p={{ base: 4, md: 5 }}>
                <Flex alignItems="center" mb={4}>
                  <Avatar
                    src={post.author.avatar}
                    name={post.author.name}
                    mr={4}
                  />
                  <Box>
                    <Text fontWeight="semibold">{post.author.name}</Text>
                    <Text color="gray.500" fontSize="sm">
                      @{post.author.username}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
            <Box h={"2px"} bg={"gray.100"} my={5} />
          </Container>
          <Box
            // h={800}
            flex={1}
            bg={"gray.50"}
            rounded={{ base: 20, lg: 24 }}
            pos={{ base: "relative", lg: "sticky" }}
            top={{ base: 0, lg: 8 }}
            p={3}
          >
            <Heading as="h2" size="lg" mb={4}>
              Related Posts
            </Heading>

            <PostsCards />
          </Box>
        </Flex>
      )}
    </>
  );
};

export default PostPage;
