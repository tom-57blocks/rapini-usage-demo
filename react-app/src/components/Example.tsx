import { useQuery } from "@tanstack/react-query";
// import { initialize } from "open-api-yml-rapini-tom";
import { initialize } from "hello-tom-rapini-demo";
// import { initialize } from "../rapini";
import axiosInstance  from  "../rapini/axios-instance";

export default function Example() {

  const id = "fake id33";

  const config = initialize(axiosInstance);

  const { useTasksControllerFindOne } = config.queries;



  // const { isLoading, error, data } = useQuery(`tasks_find_one_${id}`, () =>
  //   tasksApi.tasksControllerFindOne({
  //     id,
  //   })
  // );

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['tasks', `${id}`],
  //   queryFn: () => tasksApi.tasksControllerFindOne({id,}),
  // }
  // );

    // const { data, isLoading, isError } = useTasksControllerFindOne(`${id}`);

    const ret = useTasksControllerFindOne(`${id}`);
    console.log('ret:', ret);
    const { isLoading, isError, data } = useTasksControllerFindOne(`${id}`);


  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>An error has occurred</div>;

   // ------

  console.log('data:', data);

  // return <div>{data?.data.title}</div>;
  return <div>Test {data?.title}</div>
  //  return <div>{ret}</div>;
}
