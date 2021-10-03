<template>
    <TopMenu :buttons="buttons" />
    <PageProgressBar margin-top="60px" />
    <div class="long-page-wrapper">
        <div>
            <Toggle v-model="toggleVal" name="toggle" />
            <span>{{ toggleVal }}</span>
        </div>
        <!-- <div class="drag-drop-wrapper">
            <div class="drag-drop-left">
                <DragList :model-item-list="itemsLeft">
                    <template #default="{item}">
                        <div> {{ item.name }}</div>
                    </template>
                </DragList>
            </div>
            <div class="drag-drop-right">
                <DragList :model-item-list="itemsRight">
                    <template #default="{item}">
                        <div> {{ item.name }}</div>
                    </template>
                </DragList>
            </div>
        </div> -->
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum vel urna gravida pellentesque. 
            Phasellus ex nisi, molestie eu felis id, maximus vestibulum mi. Phasellus nec ex ornare, vestibulum ipsum eu, 
            lacinia eros. Sed dictum semper consequat. Aenean varius et ligula accumsan vehicula. Aenean vehicula sodales 
            lectus a convallis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
            Nam et risus congue lacus lobortis posuere. Aenean mollis turpis sit amet dui vestibulum, feugiat luctus enim tincidunt. 
            Aenean vel risus aliquet, placerat lorem vel, cursus eros. Nullam fermentum fringilla erat eu rhoncus.
            Pellentesque ac lacus quis enim tincidunt posuere a et nisl. Nunc condimentum justo nec neque maximus tincidunt. Aliquam erat volutpat. 
            Duis tincidunt mollis odio sit amet pulvinar. Donec scelerisque mauris at velit varius rutrum. Praesent a velit nec nulla facilisis interdum 
            id et lacus. Aenean in sollicitudin justo. Nullam luctus ex posuere urna mollis pulvinar. Suspendisse accumsan magna vel neque interdum fermentum. 
            In ut diam et leo semper rutrum sed faucibus sem. Aenean eget nisi pellentesque, sollicitudin turpis quis, suscipit arcu. Duis sit amet nunc 
            sit amet urna auctor iaculis.
            Pellentesque volutpat cursus maximus. Fusce a magna nec purus tempus interdum. Donec et magna ornare, posuere urna in, pulvinar ex. Etiam ac facilisis 
            neque, vel sagittis neque. Integer aliquet nulla non urna iaculis, id eleifend nulla congue. Sed in quam vehicula, luctus urna eu, elementum sem. 
            Pellentesque at ipsum quis sapien pharetra mattis. Proin ornare vel felis sit amet pulvinar. Curabitur est quam, tristique ut pretium congue, pretium 
            vel nulla. Morbi auctor lectus sed nunc interdum, eu lobortis urna vehicula. Donec ut auctor eros, eu fringilla nunc. Aliquam consectetur augue vitae 
            enim dapibus posuere. Proin at diam placerat, molestie orci a, luctus augue.
            Quisque suscipit justo diam, et imperdiet justo porta vitae. Aenean facilisis est non magna eleifend, nec suscipit nibh scelerisque. Integer aliquam sem 
            id purus porttitor suscipit. Aliquam euismod magna elit, id facilisis sem elementum sed. Duis eget ipsum turpis. Proin vel pretium sem, et euismod lectus. 
            Quisque at tempor erat, ut semper nunc. Donec eget urna sit amet ante gravida gravida. Quisque non sapien non nunc tempus feugiat nec ac velit. Phasellus 
            et consequat nisi. Proin rhoncus purus at leo faucibus tempor. Vestibulum varius pellentesque magna at consectetur. Aliquam erat volutpat.
            Mauris nec condimentum nulla. Nunc suscipit vestibulum tellus, sed imperdiet odio dignissim et. In hac habitasse platea dictumst. Integer ipsum libero, 
            tincidunt eu libero malesuada, scelerisque porta diam. Maecenas tincidunt ex purus, id tristique justo convallis vitae. Integer gravida bibendum cursus. 
            Morbi vel posuere sapien. Nunc congue pulvinar ex, sed laoreet quam ultricies id. Duis gravida nisi erat, sit amet condimentum lectus porttitor suscipit. 
            Integer maximus lorem ac mi hendrerit, in egestas arcu placerat. Aliquam et volutpat nunc. Nunc at tellus dapibus, tempus dolor sed, tristique est. Fusce 
            iaculis nec ligula a imperdiet. Suspendisse faucibus tincidunt pharetra. Nunc vehicula et eros convallis mattis. Nullam in augue aliquet magna commodo dictum id vel elit.
            Fusce dictum pulvinar tortor sed placerat. Nunc tempus quis enim sed auctor. Morbi non mi eget odio laoreet luctus. Mauris vel blandit enim. Aliquam 
            elementum velit enim, non hendrerit diam lobortis non. Ut iaculis, justo rhoncus ullamcorper lacinia, risus ligula gravida leo, sit amet ultrices velit 
            nisl vestibulum turpis. Sed rutrum pharetra tellus in elementum. Ut rhoncus quam risus, sed venenatis enim volutpat sit amet. Donec ut dolor a tellus 
            tristique dapibus et cursus lacus. Fusce tristique diam vitae lacus gravida, eget dignissim dui feugiat. Vestibulum ante ipsum primis in faucibus orci 
            luctus et ultrices posuere cubilia curae; In et maximus odio. Proin non sollicitudin felis. Nam ullamcorper libero sed ipsum cursus, eu gravida velit suscipit. 
            Mauris mollis placerat quam vestibulum ornare.
            Nam ac dolor nulla. Nunc congue maximus lorem, vitae lacinia tortor rutrum ut. Duis varius ac eros ut aliquam. Nullam aliquet at turpis eu vestibulum. In tristique 
            fermentum ipsum sed laoreet. Fusce justo nulla, maximus sit amet ullamcorper at, sollicitudin pellentesque magna. Vestibulum tincidunt porttitor magna ut sagittis. 
            Etiam ullamcorper molestie metus, vel eleifend sapien aliquam ac. Integer molestie erat posuere neque tristique sodales. Nam et tincidunt neque. Nulla ac tristique quam. 
            Etiam commodo gravida elit, a sollicitudin justo lobortis nec. Sed tempus elit arcu, ut faucibus felis lobortis semper.
            Curabitur malesuada urna eu ipsum fermentum ullamcorper. Aenean ut turpis bibendum, condimentum est a, accumsan massa. Proin vestibulum, odio vitae feugiat euismod, massa 
            augue consequat neque, vel posuere quam neque non lectus. Praesent condimentum interdum libero, sit amet imperdiet metus interdum ut. Duis placerat suscipit tempor. 
            Aenean et elit quis eros pulvinar blandit. Fusce tincidunt volutpat ante, sed tristique justo rutrum sit amet. Etiam interdum quam eget cursus efficitur. 
            Aenean dignissim felis sit amet augue lobortis, at ultricies tortor pulvinar. Nulla convallis condimentum est, eget lacinia sem mollis vel. Morbi hendrerit 
            tristique ipsum sed commodo. Curabitur sed leo vel massa consectetur tincidunt. Curabitur in tristique velit. Nam consequat tempor pulvinar. Curabitur sagittis laoreet interdum.
            Mauris viverra, risus ac dignissim tempor, erat eros convallis nulla, ac facilisis ex augue eget ante. Sed varius eleifend ultrices. Nunc a lectus vel turpis 
            volutpat facilisis eu eu metus. Mauris ac quam euismod, vehicula nisi at, vehicula mauris. Quisque et quam molestie, mollis mi ut, posuere lorem. Nulla auctor 
            ipsum dui, id sodales ex mollis sed. Nunc suscipit tempus ante nec dignissim. Suspendisse vel ullamcorper mauris, sed maximus eros. Sed fringilla non orci id aliquet. 
            Curabitur lobortis consequat purus, in feugiat justo pharetra at. Sed tellus lacus, pellentesque ut sem ornare, porttitor aliquet justo. Donec dapibus vehicula dolor. 
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus gravida magna tempus elementum vestibulum. Morbi urna sem, pellentesque 
            vitae fringilla eu, dignissim sed eros. Pellentesque non justo sit amet purus fermentum dignissim a a dui.
            Pellentesque ullamcorper eget lectus sed pharetra. Ut venenatis est a ipsum posuere placerat. Morbi interdum sollicitudin leo sed lacinia. Sed pharetra et magna eu iaculis. 
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc ut libero tempus ligula accumsan commodo. Donec laoreet ut risus sed pretium. 
            Cras quis urna eu libero cursus congue placerat vitae odio. Fusce eu malesuada urna. Proin id magna diam. Sed et tempor quam. Nunc dictum est nulla, eget iaculis massa laoreet vitae. 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
    </div>
    <ScrollToTop behavior="smooth" position="right" :dist="{ bottom: 40, side: 40 }" />
</template>

<script lang="ts">
    import { defineComponent }      from 'vue'
    import ScrollToTop              from "@/components/ScrollToTop.vue";
    // import DragList, { IDraggable } from "@/components/DragList/DragList.vue";
    import PageProgressBar          from "@/components/PageProgressBar.vue";
    import TopMenu                  from "@/components/TopMenu/TopMenu.vue";
    import { LinkButton }           from "@/components/TopMenu/types";

    import Toggle                   from "@/components/Toggle.vue";

    // interface Item extends IDraggable {
    //     id: number;
    //     name: string;
    // }

    export default defineComponent({
        components: {
            ScrollToTop,
            PageProgressBar,
            // DragList,
            TopMenu,
            Toggle
        },

        data() {
            return {
                buttons: [
                    { name: "crud", path: "/crud" },
                    { name: "seq-crud", path: "/seq-crud" }
                ] as Array<LinkButton>,
                // itemsLeft: [
                //     { id: 0, name: "kek" },
                //     { id: 1, name: "lol" }
                // ] as Array<Item>,
                // itemsRight: [
                //     { id: 0, name: "kek" },
                //     { id: 1, name: "lol" }
                // ] as Array<Item>,
                toggleVal: false as boolean
            }
        }
    })
</script>

<style lang="scss">
    @import "./../assets/scss/page-progress-bar/page-progress-bar.scss";

    // .page-progress-bar {
    //     margin-top: 60px;
    // }

    .long-page-wrapper {
        width: 70%;
        font-size: 18pt;
        letter-spacing: 1.3px;
        line-height: 35px;
    }

    .drag-drop-wrapper {
        display: grid;
        grid-template-columns: repeat(2, max-content);
        gap: 50px;
    }
</style>