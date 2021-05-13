<template>
    <div>
        <el-dialog :visible.sync="siteDialogVisible" title="设置目的地" width="40%" class="center-dialog">
            <div class="select-top">
                <div class="filter-container">
                    <el-input v-model="listQuery.name" placeholder="输入关键词" style="width: 300px;" class="filter-item" />
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </div>
                <div class="already-site-box">
                    <div class="title">已选目的地：</div>
                    <div class="already-site-list">
                        <div class="already-site-item" v-for="(item,index) in 20" :key="index">
                             广西{{item}}
                            <i class="el-icon-close"></i>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>
            <div class="list-wrap-box">
                <div class="item" v-for="(item,index) in 50" :key="index" :class="{'active-item':activeFlag == item}" @click="selectHandle(item)">
                    广西{{item}}
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                siteDialogVisible: false,
                activeFlag:1,
                listQuery:{
                    name:''
                }
            }
        },
        methods: {
            //搜索
            handleFilter(){

            },
            selectHandle(item){
                
            }
        },
    }
</script>

<style lang="scss" scoped>
.select-top{
    .already-site-box{
        .title{
            margin-bottom: 15px;
        }
        .already-site-list{
            display: flex;
            flex-wrap: wrap;
            .already-site-item{
                background: #f1f1f1;
                padding: 5px 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                font-size: 12px;
                .el-icon-close{
                    cursor: pointer;
                }
            }
        }
    }
}
.list-wrap-box{
    display: flex;
    flex-wrap: wrap;
    .item{
        padding: 4px 10px;
        margin: 5px 0px;
        cursor: pointer;
        &:hover{
            background: #66b1ff;
            color: #fff;
        }
    }
    .active-item{
        background: #66b1ff;
        color: #fff;
    }
}
</style>