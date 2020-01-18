import React, { Children, useState } from 'react'
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from 'reactstrap'

const MyLink = ({disabled, style, ...props}) => {
  if(disabled){
    style = {
      ...style,
      color: 'grey',
      cursor: 'not-allowed',
    }
  }
  return (
      <PaginationLink style={style} disabled={disabled} {...props} />
  )
}

export const DataPage = ({goToPage, goBack, goNext, children, pageNum, perPage}) => {
  const pages = {}
  let currPage = 0
  Children.forEach(children, (child)=> {
    let pageVal = pages[currPage] || []
    if(pageVal.length===perPage){
      currPage = currPage + 1
      pageVal = pages[currPage] || []
    }
    pageVal.push(child)
    pages[currPage] = pageVal
  })

  const totalPages = Object.keys(pages).length
  const pageNums = new Array(totalPages).fill(0).map((x, idx)=> idx + 1)

  return (
      <div>
        <Row>
          {pages[pageNum]}
        </Row>
        <Row>
          <Col style={{display: 'flex', justifyContent: 'center'}} md={{size: 2, offset: 5}}>
            <div className='mb-3'>{' '}</div>
          </Col>
          <Col style={{display: 'flex', justifyContent: 'center'}} md={{ size: 2, offset: 5}}>
            <Pagination>
          <PaginationItem>
            <MyLink onClick={()=> goToPage(0)} disabled={pageNum===0}>First</MyLink>
          </PaginationItem>
          <PaginationItem>
            <MyLink onClick={()=> goBack()}  disabled={pageNum===0} previous />
          </PaginationItem>
              {pageNums.map(page=>(
                  <PaginationItem>
                    <MyLink onClick={()=> goToPage(page-1)} disabled={pageNum===page-1}>{page}</MyLink>
                  </PaginationItem>
              ))}
          <PaginationItem>
            <MyLink onClick={()=> goNext()} disabled={pageNum>=Object.keys(pages).length-1} next/>
          </PaginationItem>
          <PaginationItem>
            <MyLink onClick={()=> goToPage(Object.keys(pages).length-1)} disabled={pageNum>=Object.keys(pages).length-1}>Last</MyLink>
          </PaginationItem>
        </Pagination>
          </Col>
        </Row>
      </div>
  )
}