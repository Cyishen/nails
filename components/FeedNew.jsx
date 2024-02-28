import { getWorkList } from '@database/actions/work.action'
import WorkList from './WorkList'
import SearchMobile from './SearchMobile'

const FeedNew = async ({}) => {
  const workList = await getWorkList({})

  return (
    <>
      <div className="px-5"> 
        <SearchMobile />
      </div>

      <WorkList data={workList?.data} hideCategories={false}/>
    </>
  )
}

export default FeedNew